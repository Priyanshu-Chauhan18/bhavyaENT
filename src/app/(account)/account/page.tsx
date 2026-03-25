import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requireActiveUser } from '@/lib/guards';

export default async function AccountPage() {
  const { profile } = await requireActiveUser();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back, {profile.full_name}</h1>
        <p className="text-sm text-slate-500">Manage your profile, browse the catalog, and track activity.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="bg-blue-50/50 rounded-t-xl pb-4">
            <CardTitle className="text-blue-900">Account Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <dl className="space-y-4">
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Full Name</dt>
                <dd className="text-sm font-medium text-slate-900">{profile.full_name}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Company</dt>
                <dd className="text-sm font-medium text-slate-900">{profile.company_name || <span className="text-slate-400 italic">Not provided</span>}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Account Role</dt>
                <dd className="text-sm font-medium text-slate-900 capitalize">{profile.role_key}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 rounded-t-xl pb-4">
            <CardTitle className="text-slate-900">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3 text-sm font-medium text-blue-600">
              <li><a href="/catalog" className="hover:text-blue-700 hover:underline inline-flex items-center gap-2">Browse the B2B Catalog <span>→</span></a></li>
              {profile.role_key === 'admin' && (
                <li><a href="/admin" className="text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center gap-2">Access Admin Dashboard <span>→</span></a></li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
