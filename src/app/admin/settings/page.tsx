import { getAdminSettings } from '@/features/admin/db/settings';
import { SettingsForm } from '@/features/admin/components/settings-form';
import { SETTINGS_KEYS } from '@/lib/config/constants';

export default async function AdminSettingsPage() {
  const settingsRows = await getAdminSettings();
  
  // Transform isolated key-value rows into a single initialData strictly matching FormContext
  const initialData: Record<string, string> = {
    company_name: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    whatsapp_number: '',
    default_seo_title: '',
    default_seo_description: '',
    hero_headline: '',
    hero_subheadline: ''
  };

  settingsRows.forEach(row => {
    if (Object.values(SETTINGS_KEYS).includes(row.key as any)) {
      initialData[row.key] = row.value_json || '';
    }
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Configuration</h1>
          <p className="text-sm text-slate-500 mt-1">Govern explicit global parameters overriding native code defaults.</p>
        </div>
      </div>

      <SettingsForm initialData={initialData as any} />
    </div>
  );
}
