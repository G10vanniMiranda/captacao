import { z } from "zod";

export const offerTypeSchema = z.enum(["SITE", "SYSTEM"]);

export const commercialPageSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+-v\d+$/),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    offerType: offerTypeSchema,
    intentId: z.string().min(1),
    problem: z.string().min(1),
    solution: z.string().min(1),
    segment: z.string().nullable(),
    title: z.string().min(1),
    description: z.string().min(1),
    headline: z.string().min(1),
    proposition: z.string().min(1),
    cta: z.string().min(1),
  })
  .strict();

export type CommercialPage = z.infer<typeof commercialPageSchema>;
export type OfferType = z.infer<typeof offerTypeSchema>;
