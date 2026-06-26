import React, { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import { ChevronRight } from "lucide-react"

// V2 Components
import ImageGalleryV2 from "@modules/products/templates/styles/style-1/components/image-gallery"
import ProductInfoV2 from "@modules/products/templates/styles/style-1/components/product-info"
import ProductActionsV2 from "@modules/products/templates/styles/style-1/components/product-actions"
import ProductDescriptionV2 from "@modules/products/templates/styles/style-1/components/product-description"
import { getProductReviews } from "@lib/data/products"
// Shared Components
import RelatedProducts from "@modules/products/components/related-products"
import ProductReviews from "@modules/products/components/product-reviews"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ViewItemEvent from "@modules/products/components/view-item-event"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@modules/common/components/shadcn/breadcrumb"
import { ProductTemplateProps } from "./types"

const ProductTemplateV2: React.FC<ProductTemplateProps> = async ({
  product,
  region,
  countryCode,
  images,
}) => {
  const t = await getTranslations("Layout.nav")

  const reviewsData = await getProductReviews({ productId: product.id })

  return (
    <div
      className="container max-w-7xl mx-auto px-4 pt-12 md:pt-14 overflow-hidden"
      data-testid="product-container"
    >
      <ViewItemEvent product={product} region={region} />
      {/* Breadcrumbs */}
      <Breadcrumb className="my-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <LocalizedClientLink href="/">{t("home")}</LocalizedClientLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight size={12} />
          </BreadcrumbSeparator>
          {product.collection && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <LocalizedClientLink
                    href={`/collections/${product.collection.handle}`}
                  >
                    {product.collection.title}
                  </LocalizedClientLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight size={12} />
              </BreadcrumbSeparator>
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage className="font-bold text-black dark:text-white">
              {product.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
          {/* Main Gallery Column */}
          <div className="md:col-span-7">
            <ImageGalleryV2 images={images} />
          </div>

          {/* Product Actions Column */}
          <div className="md:col-span-5">
            <div className="h-full flex flex-col gap-8">
              <ProductInfoV2
                product={product}
                averageRating={reviewsData.average_rating}
                reviewCount={reviewsData.count}
              />

              <div className="flex flex-col gap-y-10">
                <Suspense
                  fallback={
                    <div className="h-40 w-full animate-pulse bg-ui-bg-subtle rounded-xl" />
                  }
                >
                  <ProductActionsV2 product={product} region={region} />
                </Suspense>

                <ProductDescriptionV2 product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div
        className="mt-24 mb-16 small:my-32"
        data-testid="related-products-container"
      >
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
  )
}

export default ProductTemplateV2
