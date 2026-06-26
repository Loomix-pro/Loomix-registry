import { HttpTypes } from "@medusajs/types"

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
export async function getProductCardComponent(cardType: ProductCardType) {
  try {
    return (await import(`./${cardType}`)).default
  } catch (error) {
    console.warn(`Card component ${cardType} not found, falling back to card-1`)
    return (await import(`./card-1`)).default
  }
}

/**
 * Dynamic Product Card component that renders based on the selected card type
 */
export default async function ProductCard({
  product,
  region,
  cardType = "card-1",
}: ProductCardProps & { cardType?: ProductCardType }) {
  const CardComponent = await getProductCardComponent(cardType)
  return <CardComponent product={product} region={region} />
}
