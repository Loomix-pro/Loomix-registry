import { getStorefrontSettings } from "@lib/data/strapi-settings"
import React from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutSwitcherProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
  style?: string
}

export default async function AccountLayoutSwitcher({
  customer,
  children,
  style = "style-1",
}: AccountLayoutSwitcherProps) {
  try {
    const Component = (await import(`./styles/${style}`)).default
    return (
      <Component customer={customer}>
        {children}
      </Component>
    )
  } catch (e) {
    console.error(`Failed to load Profile Layout style: ${style}`, e)
    return notFound()
  }
}

export async function getProfileComponent(componentName: string) {
  const settings = await getStorefrontSettings()
  const style = settings?.profilePage?.template || "style-1"

  try {
    const Component = (await import(`./styles/${style}/components/${componentName}`)).default
    return Component
  } catch (error) {
    try {
      const SharedComponent = (await import(`./components/${componentName}`)).default
      return SharedComponent
    } catch (fallbackError) {
      console.error(`Failed to load Profile Component: ${componentName}`, fallbackError)
      return null
    }
  }
}


