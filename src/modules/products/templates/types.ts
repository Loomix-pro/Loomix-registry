import { HttpTypes } from "@medusajs/types"

export interface ProductTemplateProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}
