import { getStorefrontSettings } from "@lib/data/strapi-settings"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/sort-bar"

interface CategoryTemplateProps {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: any
}

const CategoryTemplate = async (props: CategoryTemplateProps) => {
  const settings = await getStorefrontSettings()
  const activeStyle = settings.storePage?.template ?? "style-1"
  const formattedStyle = activeStyle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")

  let DynamicComponent
  try {
    const mod = await import(`../../store/templates/styles/${formattedStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(
      `Category style "${formattedStyle}" not found in store styles. Error:`,
      error
    )
    const fallback = await import(`../../store/templates/styles/style-1`)
    DynamicComponent = fallback.default
  }

  if (!DynamicComponent) return null

  return <DynamicComponent {...props} />
}

export default CategoryTemplate
