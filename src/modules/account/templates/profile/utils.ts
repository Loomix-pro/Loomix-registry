import { getStorefrontSettings } from "@lib/data/strapi-settings"

export async function getProfileComponent(componentName: string) {
  const settings = await getStorefrontSettings()
  const style = settings?.profilePage?.template || "style-1"
  
  try {
    const Component = (await import(`./styles/${style}/components/${componentName}`)).default
    return Component
  } catch (error) {
    console.error(`Failed to load Profile Component: ${componentName} for style ${style}`, error)
    return null
  }
}
