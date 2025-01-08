"use client"

import Tiptap from "@/app/dashboard/add-product/tiptap";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProduct } from "@/server/actions/create-product";
import { ProductSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


export default function ProductForm() {

  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  })

  const router = useRouter()

  const {execute, status} = useAction(createProduct, {
    onSuccess: (data) => {
      if (data?.success) {
        router.push("/dashboard/products")
      }
      if (data?.error) {
      }
    }
  })

  const onsubmit = (values: z.infer<typeof ProductSchema>) => {
    execute(values)
  }

  return (
    <Card className={"mb-10"}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value}/>
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <div className={"flex items-center "}>
                      <DollarSign size={20} className={"pr-1 rounded-md"}/>
                      <Input {...field} type={"number"} placeholder="price in USD" min={0}/>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSuccess/>
            <FormError/>
            <Button
              disabled={status === "executing" || !form.formState.isValid || !form.formState.isDirty }
              type="submit">Submit
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>

  )
}
