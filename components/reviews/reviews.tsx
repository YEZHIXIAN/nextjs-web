import ReviewsChart from "@/components/reviews/reviews-chart";
import ReviewsDisplay from "@/components/reviews/reviews-display";
import ReviewsForm from "@/components/reviews/reviews-form";
import { db } from "@/server";
import { reviews } from "@/server/schema";
import { desc, eq } from "drizzle-orm";
import React from "react";

export default async function Reviews({ productID }: { productID: number }) {

  const reviewsData = await db.query.reviews.findMany({
    where: eq(reviews.productID, productID),
    with: {
      user : true
    },
    orderBy: [desc(reviews.created)]
  })

  return (
    <section className={"py-4"}>
      <h1 className={"font-bold text-sm pb-4"}>Reviews</h1>

      <div className={"flex gap-8 flex-col"}>

        <div className={"flex-1"}>
          <ReviewsDisplay reviewsData={reviewsData}/>
        </div>
        <div className={"flex-1"}>
          <ReviewsForm/>
          <ReviewsChart reviews={reviewsData}/>
        </div>
      </div>
    </section>
  )
}
