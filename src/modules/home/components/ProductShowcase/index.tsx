import { getTranslations } from "next-intl/server"
import React from "react"
import BlockError from "../BlockRenderer/block-error"

export default async function ProductShowcase(props: ProductShowcaseProps) {
  const t = await getTranslations("Blocks")

  const { style = "style-1" } = props
  const formattedStyle = style
    ? style.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
    : "style-1"

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`ProductShowcase: style "${formattedStyle}" not found.`, error)
    return (
      <BlockError
        error={error}
        formattedStyle={formattedStyle}
        blockName={t("product_showcase")}
      />
    )
  }

  if (!DynamicComponent) return null

  return <DynamicComponent {...props} />
}
