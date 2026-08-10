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

  const { contentType, style, features, testimonials } = section

  const isTestimonial = contentType === "testimonials"

  // Check if content exists
  if (isTestimonial) {
    if (!testimonials || testimonials.length === 0) return null
  } else {
    if (!features || features.length === 0) return null
  }

  const formattedStyle = style
    ? style.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
    : isTestimonial
    ? "style-3"
    : "style-1"

  const targetStyle = isTestimonial && formattedStyle === "style-1" ? "style-3" : formattedStyle

  let DynamicComponent
  try {
    const mod = await import(`./styles/${targetStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`FeaturesBlock: style "${targetStyle}" not found.`, error)
    return (
      <BlockError
        error={error}
        formattedStyle={targetStyle}
        blockName={t("features")}
      />
    )
  }

  if (!DynamicComponent) return null

  if (isTestimonial) {
    return (
      <DynamicComponent
        title={section.title}
        badge={section.badge}
        description={section.description}
        headerStyle={section.headerStyle}
        testimonials={testimonials}
      />
    )
  }

  return (
    <DynamicComponent
      title={section.title}
      badge={section.badge}
      description={section.description}
      headerStyle={section.headerStyle}
      features={features}
    />
  )
}
