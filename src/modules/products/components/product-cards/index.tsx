import { HttpTypes } from "@medusajs/types"
import dynamic from "next/dynamic"

// Export as string so that Strapi settings and other files don't break,
// while allowing any string for dynamic card loading.
export type ProductCardType = string

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

/**
 * Get the product card component dynamically based on the card type
 */
export function getProductCardComponent(cardType: ProductCardType) {
  // Use next/dynamic to support both Client and Server Components
  return dynamic(() =>
    import(`./${cardType}`).catch(() => {
      console.warn(`Card component ${cardType} not found, falling back to card-1`)
      return import(`./card-1`)
    })
  )
}

/**
 * Dynamic Product Card component that renders based on the selected card type
 */
export default function ProductCard({
  product,
  region,
  cardType = "card-1",
}: ProductCardProps & { cardType?: ProductCardType }) {
  const CardComponent = getProductCardComponent(cardType)
  return <CardComponent product={product} region={region} />
}
