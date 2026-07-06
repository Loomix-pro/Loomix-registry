import React from "react"
import { HttpTypes } from "@medusajs/types"

export type BottomNavBarProps = {
  className?: string
  stickyBottom?: boolean
  cart?: HttpTypes.StoreCart | null
  hasCategories?: boolean
  categories?: any[]
  navigationData?: any[] | null
  settings?: any
}

const BottomNavBar = async (props: BottomNavBarProps) => {
  // We use settings.header.headerStyle as a fallback if bottomNavBar style is not explicitly defined in Strapi yet
  const style = (props.settings?.bottomNavBar?.style || "style-1").trim().toLowerCase()

  let StyleComponent: React.ComponentType<any>
  try {
    const mod = await import(`./styles/${style}`)
    StyleComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`BottomNavBar style "${style}" not found. Error:`, error)
    const fallback = await import(`./styles/style-1`)
    StyleComponent = fallback.default
  }

  return <StyleComponent {...props} />
}

export default BottomNavBar

