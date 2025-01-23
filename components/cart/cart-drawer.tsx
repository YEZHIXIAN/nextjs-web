"use client"

import CartItems from "@/components/cart/cart-items";
import CartMessage from "@/components/cart/cart-message";
import Payment from "@/components/cart/payment";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useCartStore } from "@/lib/client-store";
import { ShoppingCart } from "lucide-react";

export default function CartDrawer() {
  const { cart, checkoutProgress } = useCartStore()

  return (
    <Drawer modal={false}>
      <DrawerTrigger asChild>
        <Button variant={"ghost"} className={"group flex items-center"}>
          <div className={"relative"}>
            <ShoppingCart className={"group-hover:translate-x-0.5 transition-all duration-600 ease-in-out"}/>
            {cart.length > 0 && (
              <span
                className="absolute -top-0.5 -right-1 bg-red-500 rounded-full w-2 h-2 group-hover:translate-x-0.5 transition-all duration-600 ease-in-out"
              />
            )}
          </div>

          <p className={"text-sm"}>Cart</p>
          <p className={"text-xs"}>(´･ω･)っ</p>
        </Button>
      </DrawerTrigger>

      <DrawerContent className={"fixed bottom-0 left-0 max-h-[70vh] min-h-[50vh]"}>
        <div className={"overflow-auto p-4"}>
          <CartMessage/>
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
