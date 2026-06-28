import React, { Suspense } from "react"
import ImageGalleryStyle2 from "@modules/products/templates/styles/style-2/components/image-gallery"
import ProductInfoStyle2 from "@modules/products/templates/styles/style-2/components/product-info"
import ProductActionsStyle2 from "@modules/products/templates/styles/style-2/components/product-actions"
import ProductDescriptionStyle2 from "@modules/products/templates/styles/style-2/components/product-description"
import RelatedProducts from "@modules/products/components/related-products"
import ProductReviews from "@modules/products/components/product-reviews"
import SkeletonRelatedProducts from "@/modules/common/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ViewItemEvent from "@modules/products/components/view-item-event"
import { getProductReviews } from "@lib/data/products"
import { getTranslations } from "next-intl/server"

// Using components from product-style-2 which mimic ProductClassic design
const ProductTemplateStyle2: React.FC<ProductTemplateProps> = async ({
  product,
  region,
  countryCode,
  images,
}) => {
  const t = await getTranslations("Layout.nav")

  const reviewsData = await getProductReviews({ productId: product.id })

  return (
    <div className="bg-white min-h-screen">
      <ViewItemEvent product={product} region={region} />
      <div className="max-w-7xl mx-auto px-4 pt-12 md:pt-14 pb-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm text-gray-500 items-center">
          <LocalizedClientLink
            href="/"
            className="hover:text-gray-900 cursor-pointer"
          >
            {t("home")}
          </LocalizedClientLink>
          <span className="mx-2">/</span>
          {product.collection && (
            <>
              <LocalizedClientLink
                href={`/collections/${product.collection.handle}`}
                className="hover:text-gray-900 cursor-pointer"
              >
                {product.collection.title}
              </LocalizedClientLink>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-gray-900 font-bold">{product.title}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Gallery (Left) */}
          <div className="w-full md:w-1/2">
            <ImageGalleryStyle2 images={images} />
          </div>

          {/* Details (Right) */}
          <div className="w-full md:w-1/2 flex flex-col space-y-6">
            {/* Title, Stock, SKU, Rating, Price */}
            <ProductInfoStyle2
              product={product}
              averageRating={reviewsData.average_rating}
              reviewCount={reviewsData.count}
            />

            {/* Description Box */}
            <ProductDescriptionStyle2 product={product} />

            {/* Actions: Color, Size, Qty, Add to Cart */}
            <div className="mt-4">
              <Suspense
                fallback={
                  <div className="h-40 w-full animate-pulse bg-ui-bg-subtle rounded-xl" />
                }
              >
                <ProductActionsStyle2 product={product} region={region} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-24 mb-16 small:my-32">
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={product} countryCode={countryCode} />
          </Suspense>
        </div>

        {/* Product Reviews */}
        <div
          id="reviews"
          className="content-container my-16 small:my-32 scroll-mt-24"
        >
          <ProductReviews productId={product.id} />
        </div>
      </div>
    </div>
  )
}

export default ProductTemplateStyle2
