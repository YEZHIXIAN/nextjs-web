"use server"

import { db } from "@/server";
import { auth } from "@/server/auth";
import { reviews } from "@/server/schema";
import { reviewsSchema } from "@/types/reviews-schema";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient()

export const createReview = action(reviewsSchema, async ({ productID, rating, comment }) => {
  try {
    const session = await auth()
    if (!session) return { error: "You must be logged in to leave a review" }

    const review = await db.query.reviews.findFirst({
      where: and(eq(reviews.productID, productID), eq(reviews.userID, session.user.id))
    })
    if (review) return { error: "You have already left a review for this product" }

    const newReview = await db.insert(reviews).values({
      productID,
      rating,
      comment,
      userID: session.user.id
    }).returning()

    revalidatePath(`/products/${productID}`)
    return { success: newReview[0] }

  } catch (error) {
    console.log(error)
    return { error: JSON.stringify(error) }
  }
})
