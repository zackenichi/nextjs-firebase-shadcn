'use client';

import { useState } from 'react';
import { Bell, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useGlobalProgress } from '@/components/global-progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '@/components/ui/popover';

type InvitationNotification = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  expiresAt: string;
  invitedByName: string;
};

export function NotificationCenter({ invitation }: { invitation: InvitationNotification | null }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<'accept' | 'decline' | null>(null);
  const router = useRouter();
  const progress = useGlobalProgress();

  async function respond(action: 'accept' | 'decline') {
    if (!invitation) return;
    setPending(action); progress.start();
    try {
      const response = await fetch(`/api/invitations/${invitation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Unable to respond to the invitation.');
      toast.success(action === 'accept' ? 'Invitation accepted.' : 'Invitation declined.');
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to respond to the invitation.');
    } finally {
      setPending(null); progress.done();
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label={invitation ? 'Open notifications, 1 unread' : 'Open notifications'} className="relative" />}>
        <Bell />
        {invitation && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" aria-hidden="true" />}
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-88">
        <PopoverHeader className="border-b pb-2">
          <div className="flex items-center justify-between">
            <PopoverTitle>Notifications</PopoverTitle>
            {invitation && <Badge variant="secondary">1 new</Badge>}
          </div>
          <PopoverDescription>Your latest account updates.</PopoverDescription>
        </PopoverHeader>

        {!invitation ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">You’re all caught up.</p>
        ) : (
          <div className="rounded-lg bg-primary/5 p-3">
            <div className="flex gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="size-4" /></div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{invitation.role === 'admin' ? 'Administrator' : 'User'} invitation</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{invitation.invitedByName} invited you to join as {invitation.role === 'admin' ? 'an administrator' : 'a user'}.</p>
                <p className="mt-1 text-xs text-muted-foreground">Expires {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(invitation.expiresAt))}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <Button size="sm" variant="outline" disabled={pending !== null} onClick={() => respond('decline')}>{pending === 'decline' ? 'Declining…' : 'Decline'}</Button>
              <Button size="sm" disabled={pending !== null} onClick={() => respond('accept')}>{pending === 'accept' ? 'Accepting…' : 'Accept'}</Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
