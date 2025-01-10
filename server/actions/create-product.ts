"use server"

import { db } from "@/server";
import { products } from "@/server/schema";
import { ProductSchema } from "@/types/product-schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient()

export const createProduct = action(ProductSchema, async ({ description, price, title, id }) => {
  try {
    if (id) {
      const currentProduct = await db.query.products.findFirst({
        where: eq(products.id, id)
        }
      )

      if (!currentProduct) {
        return { error: "Product not found" }
      }

      await db.update(products).set({
        description,
        price,
        title
      }).where(eq(products.id, id))

      revalidatePath("/dashboard/products")
      return { success: `Product ${title} has been edited` }

    } else {
      await db.insert(products).values({
        description,
        price,
        title
      })

      revalidatePath("/dashboard/products")
      return { success: `Product ${title} has been created"`}
    }
  }
  catch (error) {
    console.error(error)
    return { error: "Something went wrong" }
  }
})
