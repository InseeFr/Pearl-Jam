import { z } from 'zod';
import D from 'i18n';

export const contactSchema = z
  .object({
    title: z.enum(['MISTER', 'MISS'], {
      required_error: D.requiredField,
      invalid_type_error: D.requiredField,
      message: D.requiredField,
    }),
    lastName: z.string().min(1, { message: D.requiredField }),
    firstName: z.string().min(1, { message: D.requiredField }),
    phoneNumber: z
      .string()
      .optional()
      .refine(val => !val || /^\+?\d+$/.test(val), { message: D.invalidPhone }),
    email: z
      .string()
      .optional()
      .refine(val => !val || /^[^@\s]+@[^@\s]+$/.test(val), { message: D.invalidEmail }),
    preferredContact: z.string().optional(),
  })
  .transform(data => ({
    ...data,
    preferredContact: data.preferredContact === 'true',
  }));

export type ContactFormData = z.infer<typeof contactSchema>;
