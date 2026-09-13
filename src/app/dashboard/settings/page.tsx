import { DeleteAccountDialog } from '@/components/auth/delete-account-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Settings</h1><p className="mt-1 text-sm text-muted-foreground">Manage your profile and account preferences.</p></div>

      <Card>
        <CardHeader><CardTitle>Profile</CardTitle><CardDescription>This sample form will connect to the authenticated user later.</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4"><Avatar size="lg"><AvatarFallback>SU</AvatarFallback></Avatar><Button variant="outline">Change photo</Button></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><label htmlFor="display-name" className="text-sm font-medium">Display name</label><Input id="display-name" defaultValue="Sample User" /></div>
            <div className="space-y-2"><label htmlFor="account-email" className="text-sm font-medium">Email</label><Input id="account-email" type="email" defaultValue="user@example.com" disabled /></div>
          </div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>

      <Card className="ring-destructive/20">
        <CardHeader><CardTitle className="text-destructive">Danger zone</CardTitle><CardDescription>Deleting an account permanently removes its Firebase login and user profile.</CardDescription></CardHeader>
        <CardContent>
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  );
}
