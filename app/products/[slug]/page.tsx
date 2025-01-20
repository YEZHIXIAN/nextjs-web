import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";


export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      products: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  })

  if (data) {
    return data.map((variant) => ({ slug: variant.id.toString() }))
  }

  return []

}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      products: true
    }
  })

  if (!variant) {
    return <div>Item Not found</div>
  }

  return (
    <main>
      <section>
        <div>
          <h1>Images</h1>
        </div>

        <div className={"flex gap-2, flex-col, flex-1"}>
          <h2 className={""}>{variant.products.title}</h2>
          <div>
            <ProductType />
          </div>
        </div>

        <div></div>
      </section>
    </main>
  )
}
