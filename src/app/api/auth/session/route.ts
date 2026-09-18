import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse, type NextRequest } from 'next/server';

import { getInitialRole } from '@/config/auth';
import { claimPendingAdminInvitation } from '@/lib/auth/invitations';
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from '@/lib/auth/constants';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return false;

  try { return new URL(origin).host === host; } catch { return false; }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });

  try {
    const { idToken } = (await request.json()) as { idToken?: string };
    if (!idToken) return NextResponse.json({ error: 'An ID token is required.' }, { status: 400 });

    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(idToken);
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE_SECONDS * 1000 });
    const userRef = getAdminDb().collection('users').doc(decoded.uid);
    await getAdminDb().runTransaction(async (transaction) => {
      const existing = await transaction.get(userRef);
      const rootRole = getInitialRole(decoded.email);
      transaction.set(userRef, {
        email: decoded.email ?? null,
        displayName: decoded.name ?? null,
        photoURL: decoded.picture ?? null,
        role: rootRole === 'admin' ? 'admin' : existing.data()?.role ?? 'user',
        lastLoginAt: FieldValue.serverTimestamp(),
        ...(!existing.exists ? { createdAt: FieldValue.serverTimestamp() } : {}),
      }, { merge: true });
    });

    if (decoded.email && decoded.email_verified) {
      await claimPendingAdminInvitation(decoded.uid, decoded.email);
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    console.error('Unable to create Firebase session:', error);
    if (typeof error === 'object' && error && 'code' in error && error.code === 'auth/user-disabled') {
      return NextResponse.json({ error: 'This account has been suspended. Contact an administrator for help.' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Unable to complete sign in.' }, { status: 401 });
  }
}
