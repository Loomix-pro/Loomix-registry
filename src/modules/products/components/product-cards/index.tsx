export { default as ProductCard1 } from "./card-1"
import ProductCard1 from "./card-1"

import { HttpTypes } from "@medusajs/types"

// Map of card types to their components
export const CARD_COMPONENTS = {
  "card-1": ProductCard1,
  // Add more card types here as they are created:
  // "card-2": ProductCard2,
  // "card-3": ProductCard3,
} as const

// Derive the type from the actual component keys
export type ProductCardType = keyof typeof CARD_COMPONENTS

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

/**
 * Get the product card component based on the card type from Strapi settings
 */
export function getProductCardComponent(cardType: ProductCardType) {
  const CardComponent = CARD_COMPONENTS[cardType]
  return CardComponent
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
