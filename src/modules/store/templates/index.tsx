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
  const template = settings.storePage?.template ?? "style-1"

  let TemplateComponent: React.ComponentType<any>

  try {
    const importedModule = await import(`./styles/${template}`)
    TemplateComponent = importedModule.default
  } catch (e) {
    console.error(`Failed to load store template ${template}, falling back to style-1`, e)
    const fallbackModule = await import(`./styles/style-1`)
    TemplateComponent = fallbackModule.default
  }

  return <TemplateComponent {...props} />
}

export default StoreTemplate

