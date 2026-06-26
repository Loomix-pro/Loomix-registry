import { Text } from "@medusajs/ui"
import { getProductReviews } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import StarRating from "@modules/common/components/star-rating"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  // const pricedProduct = await listProducts({
  //   regionId: region.id,
  //   queryParams: { id: [product.id!] },
  // }).then(({ response }) => response.products[0])

  // if (!pricedProduct) {
  //   return null
  // }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  let rating: number | null = null
  if (product.id) {
    try {
      const reviewsData = await getProductReviews({
        productId: product.id,
        limit: 1,
      })
      if (reviewsData.average_rating > 0) {
        rating = reviewsData.average_rating
      }
    } catch (e) {
      console.error("Error fetching product reviews for preview:", e)
    }
  }

  const hasRating = rating !== null

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
        {hasRating && (
          <div className="flex items-center gap-1 mt-2">
            <StarRating
              rating={rating ?? 0}
              className="flex gap-0.5"
              iconClassName="w-3.5 h-3.5"
            />
            <Text className="text-ui-fg-subtle text-sm pr-1">
              {Number(rating).toFixed(1)}
            </Text>
          </div>
        )}
      </div>
    </LocalizedClientLink>
  )
}
