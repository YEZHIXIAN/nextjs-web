import AddCart from "@/components/cart/add-cart";
import ProductPick from "@/components/products/product-pick";
import ProductShowcase from "@/components/products/product-showcase";
import ProductType from "@/components/products/product-type";
import Reviews from "@/components/reviews/reviews";
import { getReviewAverage } from "@/components/reviews/reviews-average";
import Stars from "@/components/reviews/stars";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";



export default async function Page({ params } : { params : Promise<{ slug: string }>}) {

  const slug = (await params).slug
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(slug)),
    with: {
      products: {
        with: {
          reviews: true,
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
    },
  });

  if (!variant) {
    return <div>Item Not found</div>;
  }

  const reviewAverage = getReviewAverage(variant.products.reviews.map((review) => review.rating));

  return (
    <main>
      <section className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <ProductShowcase variants={variant.products.productVariants}/>
        </div>

        <div className="flex gap-2 flex-col flex-1">
          <h2 className="text-2xl font-bold">{variant.products.title}</h2>

          <div className="text-sm">
            <ProductType variants={variant?.products.productVariants}/>
          </div>

          <Stars rating={reviewAverage} totalReviews={variant.products.reviews.length}/>

          <Separator className="my-2"/>

          <p className="text-xl font-bold">
            {formatPrice(variant.products.price)}
          </p>

          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: variant.products.description ?? '' }}
          />

          <p className="text-secondary-foreground pt-2 text-sm font-bold">Variants</p>

          <div className="flex gap-4">
            {variant.products.productVariants.map((productVariant) => (
              <ProductPick
                key={productVariant.id}
                productID={variant.productID}
                productType={productVariant.productType}
                id={productVariant.id}
                color={productVariant.color}
                price={variant.products.price}
                title={variant.products.title}
                image={productVariant.variantImages[0]?.url}
              />
            ))}
          </div>
          <AddCart/>

          <div>
            <Reviews productID={variant.productID}/>
          </div>
        </div>
      </section>
    </main>
  );
}
