'use client';

import { LogOut } from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { firebaseAuth } from '@/lib/firebase/client';

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return <Button variant="ghost" size="sm" disabled={pending} onClick={async () => {
    setPending(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    await signOut(firebaseAuth);
    router.replace('/');
    router.refresh();
  }}><LogOut />{pending ? 'Signing out…' : 'Sign out'}</Button>;
}
