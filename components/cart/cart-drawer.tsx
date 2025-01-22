"use client"

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import { useCartStore } from "@/lib/client-store";
import { ShoppingCart } from "lucide-react";

export default function CartDrawer() {
  const { cart } = useCartStore()

  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant={"ghost"} className={"group flex items-center"}>
          <div className={"relative"}>
            <ShoppingCart className={"group-hover:translate-x-0.5 transition-all duration-600 ease-in-out"}/>
            {cart.length >= 0 && (
              <span
                className="absolute -top-0.5 -right-1 bg-red-500 rounded-full w-2 h-2 group-hover:translate-x-0.5 transition-all duration-600 ease-in-out"
              />
            )}
          </div>

          <p className={"text-sm"}>Cart</p>
          <p className={"text-xs"}>(´･ω･)っ</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          Cart
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}
