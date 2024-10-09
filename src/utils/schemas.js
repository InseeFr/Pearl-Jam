import { z } from 'zod';
import { mediumRadioValues, reasonRadioValues, TITLES, typeRadioValues } from './constants';

const stringRequired = z
  .string({ required_error: 'Ce champs est requis' })
  .min(1, { message: 'Vous devez entrer une valeur' });

export const communicationSchema = z.object({
  medium: z.enum(
    mediumRadioValues.map(v => v.value),
    { required_error: 'Requis' }
  ),
  type: z.enum(
    typeRadioValues.map(v => v.value),
    { required_error: 'Requis' }
  ),
  reason: z.enum(
    reasonRadioValues.map(v => v.value),
    { required_error: 'Requis' }
  ).optional(),
});

export const userSchema = z.object({
  title: z.enum(Object.keys(TITLES)),
  firstName: stringRequired,
  lastName: stringRequired,
  email: stringRequired.email({ message: 'Cet email ne semble pas être valide' }),
  phoneNumber: z.string().min(10, { message: 'Ce numéro de téléphone est trop court' }),
});

export const recipientSchema = z.object({
  title: z.enum(Object.keys(TITLES), { required_error: 'Requis' }),
  firstName: stringRequired,
  lastName: stringRequired,
  postCode: stringRequired,
  cityName: stringRequired,
});
