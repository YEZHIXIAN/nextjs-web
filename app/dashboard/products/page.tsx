import { columns } from "@/app/dashboard/products/columns";
import { DataTable } from "@/app/dashboard/products/data-table";
import { db } from "@/server";
import placeholder from "@/public/placeholder_small.jpg";


export default async function AddProduct() {

  const products = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  })

  if (!products) throw new Error("No products found")

  const dataTable = products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholder.src,
    }))

  if (!dataTable) throw new Error("No data found")

  return (
    <div>
      <DataTable columns={columns} data={dataTable}/>
    </div>
  )
}
