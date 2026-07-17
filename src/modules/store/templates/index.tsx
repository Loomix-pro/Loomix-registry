import { getStorefrontSettings } from "@lib/data/strapi-settings"
import { SortOptions } from "@modules/store/components/sort-bar"

interface StoreTemplateProps {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: Record<string, string | string[] | undefined>
}

const StoreTemplate = async (props: StoreTemplateProps) => {
  const settings = await getStorefrontSettings()
  const activeStyle = settings.storePage?.template ?? "style-1"
  const formattedStyle = activeStyle.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Store style "${formattedStyle}" not found or failed to load. Error:`, error)
    const fallback = await import(`./styles/style-1`)
    DynamicComponent = fallback.default
  }

  if (!DynamicComponent) return null

  return <DynamicComponent {...props} />
}

export default StoreTemplate
