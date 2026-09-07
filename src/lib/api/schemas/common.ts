import { z } from "zod";

export const pageMetaSchema = z.object({
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().positive(),
});

export const listFilterSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().optional(),
  search: z.string().optional(),
});
