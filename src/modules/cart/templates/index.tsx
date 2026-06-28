import { getTranslations } from "next-intl/server"
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
  const t = await getTranslations("Blocks")

  const settings = await getStorefrontSettings()
  const activeStyle = settings?.cartPage?.template || "style-2"
  const formattedStyle = activeStyle ? activeStyle.trim().toLowerCase() : "style-2"

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}/index`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Cart style ${formattedStyle} not found or failed to load. Error:`, error)
    return <BlockError error={error} formattedStyle={formattedStyle} blockName={t("cart")} />
  }

  if (!DynamicComponent) return null

  return (
    <>
      {settings?.cartPage?.topBannerText && (
        <div className="w-full mt-16 bg-ui-bg-subtle border-b border-ui-border-base text-ui-fg-base text-center py-3 px-4 text-sm font-medium">
          {settings.cartPage.topBannerText}
        </div>
      )}
      <DynamicComponent cart={cart} customer={customer} returnDeadlineDays={settings?.returnDeadlineDays ?? 7} />
    </>
  )
}
