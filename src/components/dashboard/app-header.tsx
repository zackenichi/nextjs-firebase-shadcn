import { CircleUserRound } from 'lucide-react';

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/logout-button';
import { NotificationCenter } from '@/components/dashboard/notification-center';
import type { AdminInvitation } from '@/lib/auth/invitations';

export function AppHeader({ name, email, photoURL, invitation }: { name: string; email: string; photoURL: string | null; invitation: AdminInvitation | null }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold">Dashboard</p>
        <p className="hidden text-xs text-muted-foreground sm:block">A ready-to-customize application workspace</p>
      </div>

      <div className="flex items-center gap-2">
        <NotificationCenter invitation={invitation} />

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-none">{name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{email}</p>
        </div>
        <Avatar size="lg">
          {photoURL && <AvatarImage src={photoURL} alt={`${name}'s profile picture`} />}
          <AvatarFallback>{name ? name.slice(0, 2).toUpperCase() : <CircleUserRound className="size-5" />}</AvatarFallback>
          <AvatarBadge className="bg-emerald-500" />
        </Avatar>
        <LogoutButton />
      </div>
    </header>
  );
}
