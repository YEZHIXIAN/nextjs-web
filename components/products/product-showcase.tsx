"use client"

import {
  Carousel, CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function ProductShowcase({ variants } : { variants : VariantsWithImagesTags[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeThumbnail, setActiveThumbnail] = useState([0])
  const selectedType = useSearchParams().get("type") || variants[0].productType
  const updatePreview = (index : number) => {
    api?.scrollTo(index)
  }

  useEffect(() => {
    if (!api) return
    api.on("slidesInView", (slides) => {
      console.log("slidesInView event", slides)
      setActiveThumbnail(slides.slidesInView())
    })
  }, [api])

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}

      >
        <CarouselContent>
          {variants.map(
            (variant) => variant.productType === selectedType &&
              (variant.variantImages.map(
                  (image) =>
                    (
                      <CarouselItem key={image.url}>
                        {image.url &&
                          (
                            <Image
                              src={image.url}
                              width={1280}
                              height={720}
                              alt={image.name}
                              className={"h-full w-full rounded-md object-cover"}
                            />
                          )
                        }
                      </CarouselItem>
                    )
                )
              )
          )}
        </CarouselContent>
        <div className="absolute top-1/2 left-2 flex items-center justify-center">
          <CarouselPrevious variant={"ghost"} className="relative left-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90"/>
        </div>
        <div className="absolute top-1/2 right-2 flex items-center justify-center">
          <CarouselNext variant={"ghost"} className="relative right-0 translate-x-0 hover:translate-x-0 hover:bg-primary/90"/>
        </div>

      </Carousel>
      <div className={"flex gap-2 pt-3 overflow-x-auto"}>
        {variants.map(
          (variant) => variant.productType === selectedType &&
            (variant.variantImages.map(
                (image, index) =>
                  (
                    <div key={image.url}>
                      {image.url &&
                        (
                          <Image
                            onClick={() => updatePreview(index)}
                            priority
                            src={image.url}
                            width={72}
                            height={48}
                            alt={image.name}
                            className={cn(
                              "h-full w-full rounded-md object-cover",
                              index === activeThumbnail[0]
                                ? "opacity-100"
                                : "opacity-50",
                              "transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75"
                            )}
                            quality={100}
                          />
                        )
                      }
                    </div>
                  )
              )
            )
        )}
      </div>
    </div>

  )
}
