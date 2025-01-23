"use client"

import { useCartStore } from "@/lib/client-store";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";

export default function CartMessage() {
  const { cart, checkoutProgress, setCheckoutProgress } = useCartStore()

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: 10 }}
    >
      <DrawerTitle style={{ textAlign: "center" }} className={"font-light mt-4 mb-2"}>
        {checkoutProgress === "cart-page" && cart.length > 0
          ? "Cart Item(s)"
          : checkoutProgress === "cart-page" && cart.length === 0
            ? "Empty Cart"
            : checkoutProgress === "payment-page"
              ? "Payment"
              : "Order Confirmed"}
      </DrawerTitle>

      <DrawerDescription style={{ textAlign: "center" }} className={"y-1 mb-6"}>
        {checkoutProgress === "cart-page" && cart.length > 0
          ? "View and manage your cart."
          : checkoutProgress === "cart-page" && cart.length === 0
            ? null
            : checkoutProgress === "payment-page"
              ? (
                <span
                  onClick={() => setCheckoutProgress("cart-page")}
                  className={"flex items-center gap-2"
                }>
                  Head back to cart <ArrowLeft size={14}/>
                </span>
              )
              : "Order Confirmed"}
      </DrawerDescription>

    </motion.div>
  )
}
