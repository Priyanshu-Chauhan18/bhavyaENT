import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createAdminSupabaseClient } from '@/lib/db/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createAdminSupabaseClient();

  // Fetch counts in parallel
  const [
    { count: totalProducts },
    { count: activeCategories },
    { count: recentEnquiries }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('enquiries').select('*', { count: 'exact', head: true })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">System overview and key metrics.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalProducts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{activeCategories || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{recentEnquiries || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
