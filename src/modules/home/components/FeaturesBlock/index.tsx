import { getTranslations } from "next-intl/server"
import React from "react"
import { FeaturesBlock as FeaturesBlockType } from "@lib/data/homepage"
import BlockError from "../../../common/components/blocks/block-error"

export interface FeaturesBlockProps {
  block: FeaturesBlockType
}

export default async function FeaturesBlock({ block }: FeaturesBlockProps) {
  const t = await getTranslations("Blocks")

  const section = block.features_section
  if (!section) return null

  const { title, style, features } = section
  if (!features || features.length === 0) return null

  const formattedStyle = style ? style.trim().toLowerCase() : "style-1"

  let DynamicComponent
  try {
    const mod = await import(
      `../../../common/components/blocks/features/${formattedStyle}`
    )
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Component style ${formattedStyle} not found or failed to load. Error:`, error)
    return <BlockError error={error} formattedStyle={formattedStyle} blockName={t("features")} />
  }

  if (!DynamicComponent) return null

  return <DynamicComponent title={title} features={features} />
}

