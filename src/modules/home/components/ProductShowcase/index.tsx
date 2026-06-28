import { getTranslations } from "next-intl/server"
import React from "react"
import BlockError from "../../../common/components/blocks/block-error"

export default async function ProductShowcase(props: ProductShowcaseProps) {
  const t = await getTranslations("Blocks")

  const { style = "style_1" } = props

  let formattedStyle = style ? style.trim().toLowerCase() : "style-1"

  let DynamicComponent
  try {
    const mod = await import(
      `../../../common/components/blocks/product-showcase/${formattedStyle}`
    )
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Component style ${formattedStyle} not found or failed to load. Error:`, error);

    return <BlockError error={error} formattedStyle={formattedStyle} blockName={t("product_showcase")} />
  }

  if (!DynamicComponent) return null

  return <DynamicComponent {...props} />
}
