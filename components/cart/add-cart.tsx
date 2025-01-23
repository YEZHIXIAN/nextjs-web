"use client"

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/client-store";
import { Minus, Plus } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AddCart() {
  const { addToCart } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const params = useSearchParams()
  const id = Number(params.get("id"))
  const title = params.get("title")
  const type = params.get("type")
  const productID = Number(params.get("productID"))
  const price = Number(params.get("price"))
  const image = params.get("image")

  if (!id || !title || !type || !productID || !image) {
    toast.error("Product not found")
    return redirect("/")
  }

  return (
    <>
      <div className={"flex items-center gap-4 justify-stretch mt-4"}>
        <Button
          disabled={quantity === 1}
          onClick={() => setQuantity(quantity - 1)}
          variant={"secondary"}
          className={"text-primary"}
        >
          <Minus size={16} strokeWidth={3}/>
        </Button>

        <Button className={"flex-1"}>Quantity: {quantity}</Button>

        <Button
          onClick={() => setQuantity(quantity + 1)}
          variant={"secondary"}
          className={"text-primary"}
        >
          <Plus size={18} strokeWidth={3}/>
        </Button>
      </div>

      <Button
        className={"mt-2"}
        variant={"secondary"}
        onClick={() => {
          toast.success(`Added ${title + " " + type} to your cart!`)
          addToCart({
            id: productID,
            variant: {
              variantID: id,
              quantity
            },
            name: title + " " + type,
            price,
            image
          })
        }}
      >
        Add to Cart
      </Button>
    </>
  )
}
