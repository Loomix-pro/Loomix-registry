import React from "react"
import { ProductTemplateProps } from "./types"
import { getStorefrontSettings } from "@lib/data/strapi-settings"
import { notFound } from "next/navigation"

const ProductTemplate: React.FC<ProductTemplateProps> = async (props) => {
  // Fetch settings from Strapi
  const settings = await getStorefrontSettings()
  const template = settings?.productPage?.template || "style-1"

  try {
    const SelectedTemplate = (await import(`./styles/${template}/index`)).default
    return <SelectedTemplate {...props} />
  } catch (e) {
    console.error(`Failed to load Product Layout style: ${template}`, e)
    return notFound()
  }
}

export default ProductTemplate
