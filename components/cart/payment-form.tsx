"use client"

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/client-store";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const { cart } = useCartStore()
  const [ loading, setLoading ] = useState(false)
  const [ errorMsg, setErrorMsg ] = useState("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    if (!stripe || !elements) {
      setLoading(false)
      return
    }

    const { error: submitError } = await elements.submit()

    if (submitError) {
      setErrorMsg(submitError.message!)
      setLoading(false)
      return
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement/>
      <AddressElement options={{ mode: "shipping" }}/>
      <Button type="submit" disabled={!stripe || !elements}>
        <span>Pay</span>
      </Button>
    </form>
  )
}
