'use client';

import Link from 'next/link';
import { LayoutDashboard, Settings, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/admin', label: 'User management', icon: ShieldCheck },
];

export function SidebarNav({ role }: { role: 'admin' | 'user' }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.filter((item) => role === 'admin' || item.href !== '/dashboard/admin').map((item) => {
        const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
