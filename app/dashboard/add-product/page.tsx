import ProductForm from "@/app/dashboard/add-product/product-form";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AddProductPage() {
  const session = await auth()
  if (session?.user.role !== "admin") {
    return redirect("/dashboard/settings")
  }

  return <ProductForm/>
}
