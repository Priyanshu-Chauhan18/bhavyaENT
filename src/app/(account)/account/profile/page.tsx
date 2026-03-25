import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="John Doe" disabled />
            <Input label="Email address" placeholder="john@example.com" disabled />
            <Input label="Company Name" placeholder="Doe Industries" disabled />
            <Input label="Phone Number" placeholder="+1234567890" disabled />
          </div>
          <div className="pt-4">
            <Button disabled>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
