"use client"

import { Badge } from "@/components/ui/badge";
import formatPrice from "@/lib/format-price";
import { VariantsWithProduct } from "@/lib/infer-type";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type VariantTypes = {
  variants: VariantsWithProduct[]
}

export default function Products({ variants }: VariantTypes) {
  return (
    <main className={"grid sm:grid-cols-1 md:grid-cols-2 gap-12 lg:grid-cols-3 pb-6"}>
      {
        variants.map((variant, index) => (
          <Link
            className={"py-2"}
            key={index}
            href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.products.price}&title=${variant.products.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
          >
            <Image
              className={"rounded-md pb-2 h-full w-full object-cover"}
              src={variant.variantImages[0].url}
              width={720}
              height={480}
              alt={variant.products.title}
              loading={"lazy"}
            />

            <div className={"flex justify-between"}>
              <div className={"font-medium"}>
                <h2>{variant.products.title}</h2>
                <p className={"text-sm text-muted-foreground"}>{variant.productType}</p>
              </div>

              <div>
                <Badge className={"text-sm"} variant={"secondary"}>
                  {formatPrice(variant.products.price)}
                </Badge>
              </div>
            </div>
          </Link>
        ))
      }
    </main>
  )
}
