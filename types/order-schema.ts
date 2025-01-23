import { z } from "zod";

export const orderSchema = z.object({
  total: z.number(),
  status: z.string(),
  products: z.array(
    z.object({
      productID: z.string(),
      variantID: z.string(),
      quantity: z.number(),
    })
  ),
})
