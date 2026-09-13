import type { ReactNode } from 'react';

import { AppMark } from '@/components/app-mark';
import { AppHeader } from '@/components/dashboard/app-header';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';

export function AppShell({ children, user }: { children: ReactNode; user: { name: string; email: string; photoURL: string | null; role: 'admin' | 'user' } }) {
  return (
    <div className="min-h-svh bg-muted/30 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b bg-background px-4 py-4 lg:fixed lg:inset-y-0 lg:w-65 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
        <AppMark />
        <div className="mt-5 lg:mt-10"><SidebarNav role={user.role} /></div>
        <div className="mt-4 hidden rounded-xl border bg-muted/40 p-4 lg:block">
          <p className="text-sm font-medium">Template mode</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">Sample data is shown until Firebase Authentication is connected.</p>
        </div>
      </aside>
      <div className="min-w-0 lg:col-start-2">
        <AppHeader name={user.name} email={user.email} photoURL={user.photoURL} />
        <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
