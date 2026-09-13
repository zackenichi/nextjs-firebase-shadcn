import type { ReactNode } from 'react';

import { AppShell } from '@/components/dashboard/app-shell';
import { getAdminDb } from '@/lib/firebase/admin';
import { getSessionUser } from '@/lib/firebase/session';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSessionUser(true);
  if (!session) redirect('/');
  const profile = await getAdminDb().collection('users').doc(session.uid).get();
  const profileData = profile.data();
  const role = profileData?.role === 'admin' ? 'admin' : 'user';
  const name = profileData?.displayName || session.name || session.email?.split('@')[0] || 'User';
  const photoURL = profileData?.photoURL || session.picture || null;
  return <AppShell user={{ name, email: session.email || '', photoURL, role }}>{children}</AppShell>;
}
