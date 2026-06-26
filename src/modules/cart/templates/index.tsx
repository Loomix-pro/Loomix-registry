import { HttpTypes } from "@medusajs/types"
import BlockError from "@modules/common/components/blocks/block-error"
import { getStorefrontSettings } from "@lib/data/strapi-settings"

export default async function CartTemplateResolver({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  const settings = await getStorefrontSettings()
  const activeStyle = settings?.cartPage?.template || "style-2"
  const formattedStyle = activeStyle ? activeStyle.trim().toLowerCase() : "style-2"

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}/index`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Cart style ${formattedStyle} not found or failed to load. Error:`, error)
    return <BlockError error={error} formattedStyle={formattedStyle} blockName="سبد خرید (Cart)" />
  }

  if (!DynamicComponent) return null

  return <DynamicComponent cart={cart} customer={customer} returnDeadlineDays={settings?.returnDeadlineDays ?? 7} />
}
