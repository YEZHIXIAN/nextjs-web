"use server"

import { db } from "@/server";
import { products, productVariants, variantImages, variantTags } from "@/server/schema";
import { VariantSchema } from "@/types/variant-schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { algoliasearch } from 'algoliasearch'

const action = createSafeActionClient()

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
)

export const createVariant = action(
  VariantSchema,
  async ({
           color,
           editMode,
           id,
           productID,
           productType,
           tags,
           variantImages: newImgs,
         }: z.infer<typeof VariantSchema>) => {

    try {
      if (editMode && id) {
        await db
          .update(productVariants)
          .set({ color, productType, updated: new Date() })
          .where(eq(productVariants.id, id))

        await db
          .delete(variantTags)
          .where(eq(variantTags.variantID, id))

        await db
          .insert(variantTags)
          .values(
            tags.map((tag) => ({
                tag,
                variantID: id
              })
            )
          )

        await db.delete(variantImages).where(eq(variantImages.variantID, id))

        await db.insert(variantImages).values(
          newImgs.map((img, index) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantID: id,
              order: index
            })
          )
        )

        const product = await db.query.products.findFirst({
          where: eq(products.id, productID)
        })

        if (product) {
          await client.partialUpdateObject({
            indexName: 'products_index',
            objectID: id.toString(),
            attributesToUpdate: {
              id: productID,
              productType: productType,
              variantImages: newImgs[0].url,
            },
          })
        }

        revalidatePath("/dashboard/products")
        return { success: `Edited ${productType}` }

      } else {

        const newVariant = await db
          .insert(productVariants)
          .values({
            color,
            productType,
            productID,
          }).returning()

        await db
          .insert(variantTags)
          .values(
            tags.map((tag) => ({
                tag,
                variantID: newVariant[0].id
              })
            )
          )

        await db
          .insert(variantImages)
          .values(
            newImgs.map((img, index) => ({
                name: img.name,
                size: img.size,
                url: img.url,
                variantID: newVariant[0].id,
                order: index
              })
            )
          )

        const product = await db.query.products.findFirst({
          where: eq(products.id, productID)
        })

        if (product) {
          await client.saveObject({
            indexName: 'products_index',
            body: {
              objectID: newVariant[0].id.toString(),
              id: productID,
              title: product.title,
              productType: productType,
              price: product.price,
              variantImages: newImgs[0].url,
            },
          })
        }
        revalidatePath("/dashboard/products")
        return { success: `Created ${productType}` }
      }

    } catch (error) {
      console.error(error)
      return { error: "Failed to create variant" }
    }
  })
