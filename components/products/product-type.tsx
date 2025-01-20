"use client"


import { VariantsWithImagesTags } from "@/lib/infer-type";
import { useSearchParams } from "next/navigation";

export default function ProductType({ variants }: { variants: VariantsWithImagesTags[] }) {
  return variants.map((variant, index) => {
    const searchParams = useSearchParams()

    if (variant.productType === )
  })
}
