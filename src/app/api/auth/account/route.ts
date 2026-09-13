import { NextResponse, type NextRequest } from 'next/server';

import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';
import { getSessionUser } from '@/lib/firebase/session';

export async function DELETE(request: NextRequest) {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  const user = await getSessionUser(true);
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  try {
    await getAdminDb().collection('users').doc(user.uid).delete();
    await getAdminAuth().deleteUser(user.uid);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, '', { httpOnly: true, expires: new Date(0), path: '/', sameSite: 'lax' });
    return response;
  } catch (error) {
    console.error('Unable to delete account:', error);
    return NextResponse.json({ error: 'Unable to delete the account.' }, { status: 500 });
  }
}
