"use server"

import { db } from "@/server";
import { products } from "@/server/schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const action = createSafeActionClient()

export const deleteProduct = action(z.object({id: z.number()}), async ({id}) => {
  try {
    const product = await db.delete(products).where(eq(products.id, id)).returning();
    revalidatePath("/dashboard/products")
    return {success: `Product ${product[0].title} deleted`}
  }
  catch (error) {
    console.error(error)
    return {error: "Error deleting product"}
  }
})
