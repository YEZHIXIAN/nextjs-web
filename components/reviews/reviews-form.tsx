"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createReview } from "@/server/actions/create-review";
import { reviewsSchema } from "@/types/reviews-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


export default function ReviewsForm() {
  const params = useSearchParams()
  const productID = Number(params.get("productID"))

  const form = useForm<z.infer<typeof reviewsSchema>>({
    resolver: zodResolver(reviewsSchema),
    defaultValues: {
      comment: "",
      rating: 0,
      productID,
    }
  })

  const { execute, status } = useAction(createReview, {
    onSuccess: ({ success, error }) => {
      if (success) {
        toast.success("Review submitted")
      } else {
        toast.error(error)
      }
    },
  })

  const onsubmit = (values : z.infer<typeof reviewsSchema>) => {
    execute({
      comment: values.comment,
      rating: values.rating,
      productID,
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={"w-full pb-4"}>
          <Button
            className={"font-medium w-full"}
            variant={"secondary"}
          >
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onsubmit)}>
            <FormField
              control={form.control}
              name={"comment"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Review
                  </FormLabel>

                  <FormControl>
                    <Textarea placeholder={"How would you describe this product?"} {...field}/>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={"rating"}
              render={(field) => (
                <FormItem className={"py-2 pb-5"}>

                  <FormLabel>
                    Rating
                  </FormLabel>

                  <FormControl>
                    <Input type={"hidden"} placeholder={"Star Rating"} {...field}></Input>
                  </FormControl>

                  <div className={"flex"}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.div
                        key={star}
                        className={"relative cursor-pointer"}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        <Star
                          key={star}
                          onClick={() => form.setValue("rating", star)}
                          className={cn(
                            "text-primary bg-transparent transition-all duration-300 ease-in-out",
                            form.getValues("rating") >= star
                              ? "fill-primary"
                              : "fill-muted"
                          )}
                        >

                        </Star>
                      </motion.div>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <Button
              type={"submit"}
              className={"w-full"}
            >
              {status === "executing" ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
