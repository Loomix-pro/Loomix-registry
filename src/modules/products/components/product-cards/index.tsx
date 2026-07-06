import { HttpTypes } from "@medusajs/types"
import ProductCard1 from "./card-1"
import ProductCard2 from "./card-2"

// Export as string so that Strapi settings and other files don't break,
// while allowing any string for dynamic card loading.
export type ProductCardType = string

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const cardMap: Record<string, React.ComponentType<ProductCardProps>> = {
  "card-1": ProductCard1,
  "card-2": ProductCard2,
}

/**
 * Dynamic Product Card component that renders based on the selected card type
 */
export default function ProductCard({
  product,
  region,
  cardType = "card-1",
}: ProductCardProps & { cardType?: ProductCardType }) {
  const CardComponent = cardMap[cardType] || ProductCard1
  return <CardComponent product={product} region={region} />
}

