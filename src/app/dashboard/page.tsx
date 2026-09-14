import { Activity, ArrowUpRight, CheckCircle2, Users } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getCurrentProfile } from '@/lib/auth/profile';
import { redirect } from 'next/navigation';

const stats = [
  { label: 'Active users', value: '1,248', change: '+12%', icon: Users },
  { label: 'Completed tasks', value: '84', change: '+8%', icon: CheckCircle2 },
  { label: 'Activity', value: '92%', change: '+4%', icon: Activity },
];

export default async function DashboardPage() {
  const user = await getCurrentProfile();
  if (!user) redirect('/');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="secondary">Sample dashboard</Badge>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Welcome back, {user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here is a quick look at what is happening today.</p>
        </div>
        <p className="text-sm text-muted-foreground">Updated just now</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, change, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex-row items-center justify-between">
              <CardDescription>{label}</CardDescription>
              <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4">
                <CardTitle className="text-3xl">{value}</CardTitle>
                <Badge variant="secondary" className="text-emerald-700"><ArrowUpRight />{change}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Workspace progress</CardTitle>
            <CardDescription>A sample of reusable dashboard content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              ['Profile setup', 80],
              ['Team onboarding', 62],
              ['Project configuration', 45],
            ].map(([label, value]) => (
              <div key={label as string} className="space-y-2">
                <div className="flex justify-between text-sm"><span className="font-medium">{label}</span><span className="text-muted-foreground">{value}%</span></div>
                <Progress value={value as number} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>People with recent workspace activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <AvatarGroup>
              {['SU', 'JD', 'AK'].map((initials) => <Avatar key={initials}><AvatarFallback>{initials}</AvatarFallback></Avatar>)}
              <AvatarGroupCount>+8</AvatarGroupCount>
            </AvatarGroup>
            <div className="mt-6 space-y-3">
              {['Workspace created', 'Profile information updated', 'New member invited'].map((item, index) => (
                <div key={item} className="flex gap-3 text-sm">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  <div><p className="font-medium">{item}</p><p className="text-xs text-muted-foreground">{index + 1} hour{index ? 's' : ''} ago</p></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
