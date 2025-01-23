import { loadStripe, Stripe } from "@stripe/stripe-js";


let stripePromise: Promise<Stripe | null> | null = null

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY!)
  }
  return stripePromise

}

export default getStripe
