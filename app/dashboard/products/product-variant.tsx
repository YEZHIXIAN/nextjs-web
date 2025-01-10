"use client"

import { InputTags } from "@/app/dashboard/products/input-tags";
import VariantImages from "@/app/dashboard/products/variant-images";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { VariantSchema } from "@/types/variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";


export const ProductVariant = (
  {
    editMode,
    productID,
    variant,
    children
  }: {
    editMode: boolean,
    productID?: number,
    variant?: VariantsWithImagesTags,
    children: React.ReactNode
  }) => {

  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000000",
      editMode,
      id: undefined,
      productID,
      productType: "Black Notebook",
    }
  })

  function onSubmit(values: z.infer<typeof VariantSchema>) {
    console.log(values)
  }

  return (
    <Dialog modal={false}>
      <DialogTrigger>
        {children}
      </DialogTrigger>

      <DialogContent className={"lg:max-w-screen-lg max-h-[860px] overflow-auto"}>
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input placeholder="pick a title for your variant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type={"color"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <VariantImages/>
            {editMode && variant && (
              <Button type={"button"} variant={"destructive"} onClick={(e) => e.preventDefault()}>
                Delete Variant
              </Button>
            )}
            <Button type="submit">{editMode ? "Update Variant" : "Create Variant"}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
