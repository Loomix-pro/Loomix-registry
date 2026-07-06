import { getStorefrontSettings } from "@lib/data/strapi-settings"
import { HttpTypes } from "@medusajs/types"

interface OrderCompletedTemplateProps {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate(props: OrderCompletedTemplateProps) {
  const settings = await getStorefrontSettings()
  const activeStyle = settings.orderPage?.template ?? "style-1"
  const formattedStyle = activeStyle.trim().toLowerCase()

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Order style "${formattedStyle}" not found or failed to load. Error:`, error)
    const fallback = await import(`./styles/style-1`)
    DynamicComponent = fallback.default
  }

  if (!DynamicComponent) return null

  return <DynamicComponent {...props} />
}
