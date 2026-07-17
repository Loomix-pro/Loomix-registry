import React from "react"
import { listProducts } from "@lib/data/products"
import ProductScrollStage from "@/modules/home/components/ProductSplitView/ProductScroll"
import SplitBannerStage from "@modules/home/components/ProductSplitView/SplitBannerStage"
import { HttpTypes } from "@medusajs/types"
import { ProductSplitViewBlock as BlockType } from "@lib/data/homepage"

interface ProductSplitViewBlockProps {
  block: BlockType
  region: HttpTypes.StoreRegion
  countryCode: string
  index: number
}

export default async function ProductSplitViewBlock({
  block,
  region,
  countryCode,
  index,
}: ProductSplitViewBlockProps) {
  const sectionsToRender = []

  // 1. Render Product Scroll Stage if present
  if (block.productScroll) {
    const productIds =
      block.productScroll.products?.map((p) => p.medusaId) || []
    if (productIds.length > 0) {
      // Fetch the Medusa products using the IDs from Strapi
      const {
        response: { products },
      } = await listProducts({
        countryCode,
        queryParams: {
          id: productIds,
          limit: productIds.length,
        },
      })

      // Ensure order matches Strapi array
      const orderedProducts = productIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean)

      if (orderedProducts.length > 0) {
        sectionsToRender.push(
          <ProductScrollStage
            key={`${block.id || index}-products`}
            products={orderedProducts as any[]}
            region={region}
            title={block.productScroll.title}
            badge={block.productScroll.badge}
            description={block.productScroll.description}
            buttonText={block.productScroll.buttonText}
            buttonLink={block.productScroll.buttonLink}
            style={block.productScroll.style}
            headerStyle={block.productScroll.headerStyle}
            cardStyle={block.productScroll.cardStyle}
            image={block.productScroll.image}
          />
        )
      }
    }
  }

  // 2. Render Split Banner Stage if present
  if (block.banner_section) {
    sectionsToRender.push(
      <SplitBannerStage
        key={`${block.id || index}-banner`}
        banner={block.banner_section}
      />
    )
  }

  if (sectionsToRender.length > 0) {
    return (
      <React.Fragment key={block.id || index}>
        {sectionsToRender}
      </React.Fragment>
    )
  }

  return null
}
