import { getTranslations } from "next-intl/server"
import React from "react"
import BlockError from "@/modules/common/components/blocks/block-error"

export default async function ProductScrollStage(props: ScrollStageProps) {
  const t = await getTranslations("Blocks")

  const { style = "style-1" } = props

  let formattedStyle = style ? style.trim().toLowerCase() : "style-1"

  let DynamicComponent
  try {
    const mod = await import(
      `../../../../common/components/blocks/ProductSplitView/product-scroll/${formattedStyle}`
    )
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Component style ${formattedStyle} not found or failed to load. Error:`, error);

    return <BlockError error={error} formattedStyle={formattedStyle} blockName={t("product_scroll")} />

  }

  if (!DynamicComponent) return null

  return <DynamicComponent {...props} />
}
