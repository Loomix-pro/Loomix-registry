import { HttpTypes } from "@medusajs/types"
import { getTranslations } from "next-intl/server"
import ProductPrice from "@modules/products/components/product-price"
import StarRating from "@modules/common/components/star-rating"

interface ProductInfoProps {
  product: HttpTypes.StoreProduct
  averageRating?: number
  reviewCount?: number
}

/**
 * ProductInfoStyle2 Component
 *
 * Displays the core information of a product including title, stock status, SKU,
 * average rating, review count, and price in a specific layout style (Style 2).
 *
 * @param product - The store product data
 * @param averageRating - The computed average rating score for the product
 * @param reviewCount - The total number of reviews for the product
 * @returns React Component displaying product information
 */
export default async function ProductInfoStyle2({
  product,
  averageRating = 0,
  reviewCount = 0,
}: ProductInfoProps) {
  const t = await getTranslations("Product.info")
  return (
    <div className="pb-6 border-b border-gray-200">
      <h1 className="text-3xl font-extrabold text-gray-900 leading-snug">
        {product.title}
      </h1>
      <div className="flex items-center mt-3 gap-3">
        {/* Simple In Stock badge - logic can be improved to check inventory */}
        <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
          {t("in_stock")}
        </div>
        <div className="text-gray-400 text-xs">
          {t("sku")} {product.variants?.[0]?.sku ?? "-"}
        </div>
      </div>
      <div className="flex items-center justify-between py-4">
        <a
          href="#reviews"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-orange-500 font-bold text-xl">
            {averageRating.toFixed(1)}
          </span>
          <StarRating rating={averageRating} />
          <span className="text-gray-400 text-sm">
            {reviewCount > 0
              ? t("reviews_count", { count: reviewCount })
              : t("no_reviews")}
          </span>
        </a>
        <div className="text-right">
          <ProductPrice product={product} variant={undefined} />
        </div>
      </div>
    </div>
  )
}
