import { z } from "zod";

const toNumber = (v) => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

export const eventSearchSchema = z
  .object({
    q: z.string().trim().min(1).max(200).optional(),
    category: z.string().trim().min(1).max(64).optional(),
    location: z.string().trim().min(1).max(120).optional(),
    dateFrom: z.string().datetime({ offset: true }).optional(),
    dateTo: z.string().datetime({ offset: true }).optional(),
    priceMin: z.preprocess(toNumber, z.number().min(0).optional()),
    priceMax: z.preprocess(toNumber, z.number().min(0).optional()),
    sort: z.enum(["starts_at", "price_eur", "title", "created_at"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.preprocess(toNumber, z.number().int().min(1).max(10_000).optional()),
    limit: z.preprocess(toNumber, z.number().int().min(1).max(60).optional())
  })
  .refine((v) => (v.dateFrom && v.dateTo ? new Date(v.dateFrom) <= new Date(v.dateTo) : true), {
    message: "dateFrom duhet te jete <= dateTo",
    path: ["dateFrom"]
  })
  .refine((v) => (v.priceMin !== undefined && v.priceMax !== undefined ? v.priceMin <= v.priceMax : true), {
    message: "priceMin duhet te jete <= priceMax",
    path: ["priceMin"]
  });

