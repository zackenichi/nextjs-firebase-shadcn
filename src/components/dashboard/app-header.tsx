import { Bell, CircleUserRound } from 'lucide-react';

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogoutButton } from '@/components/auth/logout-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';

export function AppHeader({ name, email, photoURL }: { name: string; email: string; photoURL: string | null }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold">Dashboard</p>
        <p className="hidden text-xs text-muted-foreground sm:block">A ready-to-customize application workspace</p>
      </div>

      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label="Open notifications" />}>
            <Bell />
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={8} className="w-80">
            <PopoverHeader className="border-b pb-2">
              <div className="flex items-center justify-between">
                <PopoverTitle>Notifications</PopoverTitle>
                <Badge variant="secondary">2 new</Badge>
              </div>
              <PopoverDescription>Your latest account updates.</PopoverDescription>
            </PopoverHeader>
            <div className="space-y-1">
              <div className="rounded-md p-2 hover:bg-muted">
                <p className="text-sm font-medium">Welcome to your workspace</p>
                <p className="mt-1 text-xs text-muted-foreground">Your sample dashboard is ready to customize.</p>
              </div>
              <div className="rounded-md p-2 hover:bg-muted">
                <p className="text-sm font-medium">Complete your profile</p>
                <p className="mt-1 text-xs text-muted-foreground">Add your name and profile photo in Settings.</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>

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
