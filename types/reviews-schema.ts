import { z } from "zod";


export const reviewsSchema = z.object({
  productID: z.number(),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1 star" })
    .max(5, { message: "Rating must be at most 5 stars" }),
  comment: z
    .string()
    .min(10, { message: "Comment must be at least 10 characters" })
    .max(140, { message: "Comment must be at most 140 characters" }),

})
