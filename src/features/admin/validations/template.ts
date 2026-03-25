import { z } from 'zod';

export const AdminTemplateSchema = z.object({
  id: z.string().uuid().optional(),
  template_name: z.string().min(2, 'Template Name is required').max(100),
  template_text: z.string().min(10, 'Template Text is required').max(1000),
  whatsapp_number: z.string().min(5, 'WhatsApp Routing Number is required').max(30),
  product_id: z.string().uuid().nullable().optional().or(z.literal('')),
  category_id: z.string().uuid().nullable().optional().or(z.literal('')),
  is_default: z.boolean(),
  is_active: z.boolean(),
});

export type AdminTemplateFormContext = z.infer<typeof AdminTemplateSchema>;
