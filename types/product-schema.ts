import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, {
    message: "Title must be at least 5 characters",
  }),
  description: z.string().min(40, {
    message: "Description must be at least 10 characters",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .nonnegative({ message: "Price must be a non-negative number" }),
})
