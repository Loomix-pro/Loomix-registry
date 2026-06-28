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
  const style = props.settings?.bottomNavBar?.style || props.settings?.header?.headerStyle || "style-1"
  let StyleComponent: any

  try {
    const importedModule = await import(`./styles/${style}`)
    StyleComponent = importedModule.default
  } catch (error) {
    console.error(`Failed to load BottomNavBar style: ${style}, falling back to style-1`, error)
    const importedModule = await import(`./styles/style-1`)
    StyleComponent = importedModule.default
  }

  return <StyleComponent {...props} />
}

export default BottomNavBar

