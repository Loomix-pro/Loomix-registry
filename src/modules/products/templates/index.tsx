import React from "react"
import { getStorefrontSettings } from "@lib/data/strapi-settings"
import { notFound } from "next/navigation"

const ProductTemplate: React.FC<ProductTemplateProps> = async (props) => {
  const settings = await getStorefrontSettings()
  const activeStyle = settings.productPage?.template ?? "style-1"
  const formattedStyle = activeStyle.trim().toLowerCase()

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Product style "${formattedStyle}" not found or failed to load. Error:`, error)
    const fallback = await import(`./styles/style-1`)
    DynamicComponent = fallback.default
  }

  if (!DynamicComponent) {
    console.error(`Product style "${formattedStyle}" resolved to null.`)
    return notFound()
  }

  return <DynamicComponent {...props} />
}

export default ProductTemplate
