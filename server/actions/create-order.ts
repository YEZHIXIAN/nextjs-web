"use server"

import { db } from "@/server";
import { auth } from "@/server/auth";
import { orderProduct, orders } from "@/server/schema";
import { createOrderSchema } from "@/types/order-schema";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";


const action = createSafeActionClient()

export const createOrder = action(
  createOrderSchema,
  async ({ total, status, paymentIntentID, products } : z.infer<typeof createOrderSchema>) => {
    console.log("Creating order")
    const user = await auth()
    if (!user) return { error: "You must be logged in to create an order" }

    const order = await
      db
        .insert(orders)
        .values({
          status,
          total,
          paymentIntentID,
          userID: user.user.id
        }).returning()

    products.map(
      async ({ productID, quantity, variantID }) => {
        await
          db
            .insert(orderProduct)
            .values({
              orderID: order[0].id,
              productID,
              quantity,
              productVariantID: variantID
            })
      }
    )

    return { success: "Order has been created" }
  }
)
