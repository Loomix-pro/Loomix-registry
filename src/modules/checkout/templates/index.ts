import { getStorefrontSettings } from "@lib/data/strapi-settings"

export async function getCheckoutSummaryComponent() {
  const settings = await getStorefrontSettings()
  const template = settings?.checkoutPage?.template || "style-1"

  return (
    await import(`./checkout-form/styles/${template}/summary`)
  ).default
}

export async function getCheckoutFormComponent() {
  const settings = await getStorefrontSettings()
  const template = settings?.checkoutPage?.template || "style-1"

  return (
    await import(`./checkout-form/styles/${template}/index`)
  ).default
}
