import 'server-only';

import { cache } from 'react';

import { getAdminDb } from '@/lib/firebase/admin';
import { getSessionUser } from '@/lib/firebase/session';

export const getCurrentProfile = cache(async () => {
  const session = await getSessionUser(true);
  if (!session) return null;

  const profile = await getAdminDb().collection('users').doc(session.uid).get();
  const data = profile.data();

  return {
    name: data?.displayName || session.name || session.email?.split('@')[0] || 'User',
    email: data?.email || session.email || '',
    photoURL: data?.photoURL || session.picture || null,
    role: data?.role === 'admin' ? 'admin' as const : 'user' as const,
  };
});
