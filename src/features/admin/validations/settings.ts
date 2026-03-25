import { z } from 'zod';

export const SettingsSchema = z.object({
  company_name: z.string().max(100).nullable().optional(),
  company_email: z.string().email().nullable().optional().or(z.literal('')),
  company_phone: z.string().max(30).nullable().optional(),
  company_address: z.string().max(255).nullable().optional(),
  whatsapp_number: z.string().max(30).nullable().optional(),
  default_seo_title: z.string().max(150).nullable().optional(),
  default_seo_description: z.string().max(300).nullable().optional(),
  hero_headline: z.string().max(150).nullable().optional(),
  hero_subheadline: z.string().max(300).nullable().optional(),
});

export type SettingsFormContext = z.infer<typeof SettingsSchema>;
