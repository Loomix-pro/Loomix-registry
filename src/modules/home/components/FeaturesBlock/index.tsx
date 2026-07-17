import { getTranslations } from "next-intl/server"
import React from "react"
import type { FeaturesBlock as FeaturesBlockType } from "@lib/data/homepage"
import BlockError from "../BlockRenderer/block-error"

export interface FeaturesBlockProps {
  block: FeaturesBlockType
}

export default async function FeaturesBlock({ block }: FeaturesBlockProps) {
  const t = await getTranslations("Blocks")

  const section = block.features_section
  if (!section) return null

  const { style, features } = section
  if (!features || features.length === 0) return null

  const formattedStyle = style
    ? style.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
    : "style-1"

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`FeaturesBlock: style "${formattedStyle}" not found.`, error)
    return (
      <BlockError
        error={error}
        formattedStyle={formattedStyle}
        blockName={t("features")}
      />
    )
  }

  if (!DynamicComponent) return null

  return <DynamicComponent features={features} />
}
