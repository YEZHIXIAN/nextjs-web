"use server"

import { auth } from "@/server/auth";
import { paymentIntentSchema } from "@/types/payment-intent-schema";
import { createSafeActionClient } from "next-safe-action";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const action = createSafeActionClient()

export const createPaymentIntent = action(
  paymentIntentSchema,
  async ({ amount, cart, currency }) => {
    const user = await auth()
    if (!user) return { error: "You must be logged in to make a payment" }
    if (!amount) return { error: "Invalid amount" }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        cart: JSON.stringify(cart)
      }
    })

    return {
      success: {
        paymentIntentID: paymentIntent.id,
        clientSecretID: paymentIntent.client_secret,
        user: user.user.email
      }
    }
  })
