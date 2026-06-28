import { getStorefrontSettings } from "@lib/data/strapi-settings"
import { HttpTypes } from "@medusajs/types"

interface OrderCompletedTemplateProps {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate(props: OrderCompletedTemplateProps) {
  const settings = await getStorefrontSettings()
  const template = settings.orderPage?.template ?? "style-1"

  let TemplateComponent: React.ComponentType<any>

  try {
    const importedModule = await import(`./styles/${template}`)
    TemplateComponent = importedModule.default
  } catch (e) {
    console.error(`Failed to load order completed template ${template}, falling back to style-1`, e)
    const fallbackModule = await import(`./styles/style-1`)
    TemplateComponent = fallbackModule.default
  }

  return <TemplateComponent {...props} />
}

