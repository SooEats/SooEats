import { z } from "zod";

const optionalStock = z.preprocess(
  (value) => (value === "" || value === null ? null : value),
  z.coerce.number().int().min(0).nullable()
);

export const menuAdminSchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(140).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(1).max(1000),
  price: z.coerce.number().min(0),
  imageUrl: z.string().trim().min(1),
  serving: z.string().trim().min(1).max(120),
  category: z.enum(["BREAKFAST", "LUNCH", "DRINKS", "DESSERT"]),
  calories: z.coerce.number().min(0),
  protein: z.coerce.number().min(0),
  carbs: z.coerce.number().min(0),
  fats: z.coerce.number().min(0),
  isAvailable: z.boolean(),
  stockQuantity: optionalStock,
  sortOrder: z.coerce.number().int().min(0),
});

export type MenuAdminInput = z.infer<typeof menuAdminSchema>;
