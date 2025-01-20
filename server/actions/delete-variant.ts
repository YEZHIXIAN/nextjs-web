"use server"

import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { algoliasearch } from "algoliasearch";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const action = createSafeActionClient()

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
)


export const deleteVariant = action(z.object({ id: z.number() }), async (id) => {
  try {
    const variant = await db.delete(productVariants).where(eq(productVariants.id, id)).returning();
    revalidatePath("/dashboard/products")

    await client.deleteObject({
        indexName: "products",
        objectID: variant[0].id.toString(),
      }
    )
    return { success: `Deleted ${variant[0].productType}` }
  } catch (error) {
    console.error(error)
    return { error: "Failed to delete variant" }
  }
})
