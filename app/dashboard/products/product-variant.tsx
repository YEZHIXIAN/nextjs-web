"use client"

import { InputTags } from "@/app/dashboard/products/input-tags";
import VariantImages from "@/app/dashboard/products/variant-images";
import { VariantsWithImagesTags } from "@/lib/infer-type";
import { createVariant } from "@/server/actions/create-variant";
import { VariantSchema } from "@/types/variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import React, { forwardRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { deleteVariant } from "@/server/actions/delete-variant";
import { Input } from "@/components/ui/input";

type VariantProps = {
  children: React.ReactNode
  editMode: boolean
  productID?: number
  variant?: VariantsWithImagesTags
}

export const ProductVariant = forwardRef<HTMLDivElement, VariantProps>(
  ({ editMode, productID, variant, children }, ref) => {
    console.log(ref)
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

    const [open, setOpen] = React.useState(false)

    const setEdit = () => {
      if (!editMode) {
        form.reset()
      } else {
        form.setValue("editMode", true)
        form.setValue("id", variant!.id)
        form.setValue("productType", variant!.productType)
        form.setValue("color", variant!.color)
        form.setValue(
          "tags",
          variant!.variantTags.map((tag) => tag.tag)
        )
        form.setValue(
          "variantImages",
          variant!.variantImages.map((img) => ({
            name: img.name,
            size: img.size,
            url: img.url
          }))
        )
      }
    }

    useEffect(() => {
      setEdit()
    }, [])

    const { execute } = useAction(createVariant, {
      onExecute() {
        setOpen(false)
      },

      onSuccess() {
        if (editMode) {
          toast.success("Variant Updated")
        } else {
          toast.success("Variant Created")
        }
      },
    })

    function onSubmit(values: z.infer<typeof VariantSchema>) {
      execute(values)
    }

    const variantAction = useAction(deleteVariant, {
      onExecute() {
        setOpen(false)
      },
      onSuccess(data) {
        if (data?.error) {
          toast.error(data.error)
        }
        if (data?.success) {
          toast.success(data.success)
        }
      }
    })

    return (
      <Dialog modal={false} open={open} onOpenChange={setOpen}>
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
                    <FormMessage/>
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
                    <FormMessage/>
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
                    <FormMessage/>
                  </FormItem>
                )}
              />

              <VariantImages/>
              <div className={"flex gap-4 items-center"}>
                {editMode && variant && (
                  <Button
                    type={"button"}
                    variant={"destructive"}
                    onClick={(e) => {
                      e.preventDefault()
                      variantAction.execute({ id: variant.id })
                    }}>

                    Delete Variant
                  </Button>
                )}
                <Button type="submit">{editMode ? "Update Variant" : "Create Variant"}</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  }
)

ProductVariant.displayName = "ProductVariant"
