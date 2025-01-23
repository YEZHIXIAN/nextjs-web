"use server"

import { createSafeActionClient } from "next-safe-action";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const action = createSafeActionClient()

export const createPaymentIntent = action(async ({ amount }) => {

})
