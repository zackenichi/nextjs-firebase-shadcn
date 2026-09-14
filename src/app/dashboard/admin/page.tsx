import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { UserManagement } from '@/components/admin/user-management';
import { Badge } from '@/components/ui/badge';
import { appConfig } from '@/config/app';
import { getAdminSession } from '@/lib/auth/admin';
import { listManagedUsers } from '@/lib/auth/users';

export const metadata: Metadata = {
  title: 'User management',
};

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect('/dashboard');

  const { users, nextPageToken } = await listManagedUsers(session.uid);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2"><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">User management</h1><Badge>Admin</Badge></div>
      </div>
      <UserManagement initialUsers={users} initialNextPageToken={nextPageToken} appName={appConfig.name} />
    </div>
  );
}
