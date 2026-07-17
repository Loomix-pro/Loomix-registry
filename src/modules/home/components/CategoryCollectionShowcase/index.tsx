import { getTranslations } from "next-intl/server"
import React from "react"
import type { CategoryCollectionBlock } from "@lib/data/homepage"
import BlockError from "../BlockRenderer/block-error"

interface CategoryCollectionShowcaseProps {
  block: CategoryCollectionBlock
}

export default async function CategoryCollectionShowcase({
  block,
}: CategoryCollectionShowcaseProps) {
  const t = await getTranslations("Blocks")

  const section = block.section
  if (!section) {
    return <BlockError error="No section data found for this block" />
  }

  const formattedStyle = section.style
    ? section.style.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
    : "style-1"

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`CategoryCollectionShowcase: style "${formattedStyle}" not found.`, error)
    return (
      <BlockError
        error={error}
        formattedStyle={formattedStyle}
        blockName={t("category-collection") || "category-collection"}
      />
    )
  }

  if (!DynamicComponent) return null

  return (
    <div className="w-full">
      <DynamicComponent section={section} />
    </div>
  )
}
