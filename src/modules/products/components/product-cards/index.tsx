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
 * Cache for dynamic card components.
 * Prevents re-creating a new dynamic() on every render, which would cause
 * React to unmount/remount the component and trigger unnecessary loading states.
 */
const componentCache = new Map<string, ReturnType<typeof dynamic<ProductCardProps>>>()

/**
 * Get the product card component dynamically based on the card type.
 * The result is cached per cardType so dynamic() is only called once per type.
 */
export function getProductCardComponent(cardType: ProductCardType) {
  if (componentCache.has(cardType)) {
    const cachedComponent = componentCache.get(cardType)
    if (cachedComponent) return cachedComponent
  }

  const Component = dynamic<ProductCardProps>(
    () =>
      import(`./${cardType}`).catch(() => {
        console.warn(`Card component ${cardType} not found, falling back to card-1`)
        return import(`./card-1`)
      }) as unknown as Promise<{ default: React.ComponentType<ProductCardProps> }>,
    { loading: () => null }
  )

  componentCache.set(cardType, Component)
  return Component
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

