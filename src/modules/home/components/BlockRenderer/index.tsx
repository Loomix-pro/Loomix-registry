import React from "react"
import { HomepageBlock } from "@lib/data/homepage"
import { HttpTypes } from "@medusajs/types"
import ProductSplitViewBlock from "./ProductSplitViewBlock"
import ProductShowcaseBlock from "./ProductShowcaseBlock"
import FeaturesBlock from "./FeaturesBlock"
import BlogPostsBlock from "./BlogPostsBlock"

interface BlockRendererProps {
  block: HomepageBlock
  region: HttpTypes.StoreRegion
  countryCode: string
  index: number
}

export default async function BlockRenderer({
  block,
  region,
  countryCode,
  index,
}: BlockRendererProps) {
  switch (block.__component) {
    case "ui.product-split-view":
      return (
        <ProductSplitViewBlock
          block={block}
          region={region}
          countryCode={countryCode}
          index={index}
        />
      )
    case "ui.product-showcase-block":
      return (
        <ProductShowcaseBlock
          block={block}
          countryCode={countryCode}
          index={index}
        />
      )
    case "ui.features-block":
      return <FeaturesBlock block={block} />
    case "ui.blog-posts-block":
      return <BlogPostsBlock block={block} />
    default:
      console.warn(
        `[BlockRenderer] Unknown block component type: ${
          (block as any).__component
        }`
      )
      return null
  }
}
