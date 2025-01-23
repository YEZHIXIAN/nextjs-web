"use client"

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/client-store";
import Link from "next/link";

export default function OrderConfirmed() {

  const { setCheckoutProgress } = useCartStore()

  return (
    <div>
      <h2>Thanks for your purchase!</h2>
      <Link href={"/dashboard/orders"}>
        <Button
          onClick={() => {
            setCheckoutProgress("cart-page");
          }}
        >
          View your order
        </Button>
      </Link>
    </div>
  )
}
