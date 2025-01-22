"use client"

import Stars from "@/components/reviews/stars";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ReviewsWithUser } from "@/lib/infer-type";
import { motion } from "motion/react"
import Image from "next/image";
import React from "react";
import { formatDistance, subDays } from "date-fns";

export default function ReviewsDisplay({ reviewsData } : { reviewsData : ReviewsWithUser[] }) {

  console.log("reviewData", reviewsData)

  return (
    <motion.div className={"flex flex-col gap-4"}>
      {
        reviewsData.map(
          (review) => (
            <Card
              key={review.id}
              className={"flex flex-col gap-2 p-4"}
            >
              <div className={"flex gap-2 items-center"}>
                <Avatar className={"w-9 h-9"}>
                  <Image
                    src={review.user.image!}
                    alt={review.user.name!}
                    fill={true}
                  />
                </Avatar>

                <div>
                  <p className={"text-sm font-bold pb-0.75"}>{review.user.name}</p>
                  <div className={"flex items-center gap-2"}>
                    <Stars rating={review.rating}/>
                    <p className={"text-xs text-bold text-muted-foreground"}>
                      {formatDistance(subDays(review.created!, 0), new Date())}
                    </p>
                  </div>
                </div>
              </div>

              <p className={"text-sm font-medium"}>{review.comment}</p>

            </Card>
          ))
      }
    </motion.div>
  )
}
