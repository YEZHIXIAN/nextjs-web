"use client"

import Stars from "@/components/reviews/stars";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReviewsWithUser } from "@/lib/infer-type";
import { useMemo } from "react";

export default function ReviewsChart({ reviews } : { reviews : ReviewsWithUser[] }) {

  const getRatingByStars = useMemo(() => {
    const ratingValues = Array.from({ length : 5}, () => 0)
    const totalReviews = reviews.length
    reviews.forEach((review) => {
      const starIndex = review.rating - 1
      if (starIndex >= 0 && starIndex < 5) {
        ratingValues[starIndex] += 1
      }
    })
    return ratingValues.map((rating) => rating / totalReviews * 100)
  }, [reviews])

  const totalRating = reviews.length === 0 ? 0 : reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length

  return (
    <Card className={"flex flex-col p-8 rounded-md gap-6 my-4 border-transparent"}>
      <div className={"flex flex-col gap-2"}>
        <CardTitle>Product Rating</CardTitle>
        <Stars size={18} rating={totalRating} totalReviews={reviews.length}/>
        <CardDescription>
          {totalRating.toFixed(1)}
        </CardDescription>
      </div>
      {getRatingByStars.slice().reverse().map((rating, index) => (
        <div key={index} className={"flex gap-2 justify-between items-center"}>
          <p className={"text-cs font-medium flex"}>
            {5 - index}
            <span>stars</span>
          </p>
          <Progress value={rating}/>
        </div>
      ))}
    </Card>
  )
}
