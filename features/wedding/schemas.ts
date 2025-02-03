import * as z from 'zod';

export const weddingSetupSchema = z.object({
  brideName: z.string().min(2, 'Ime mlade mora imati bar 2 karaktera'),
  groomName: z.string().min(2, 'Ime mladoženje mora imati bar 2 karaktera'),
  venue: z.object({
    name: z.string().min(2, 'Naziv lokacije mora imati bar 2 karaktera'),
    address: z.string().min(5, 'Adresa mora imati bar 5 karaktera'),
    hall: z.string().min(2, 'Naziv sale mora imati bar 2 karaktera'),
  }),
  date: z.string().min(1, 'Datum je obavezan'),
  pricePerPerson: z.string().transform((val) => Number(val)),
});