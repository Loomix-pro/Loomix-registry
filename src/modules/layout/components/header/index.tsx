import React from "react"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listCategories } from "@lib/data/categories"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getStorefrontSettings } from "@lib/data/strapi-settings"
import { getNavigation } from "@lib/data/navigation"
import { formatPhoneOrEmail } from "@lib/util/phone"
import { User } from "./types"
import { NAV_ITEMS as FALLBACK_NAV_ITEMS } from "./constants"
import MobileTopBar from "@modules/layout/components/mobile-top-bar"

const Header = async ({ countryCode }: { countryCode: string }) => {
  const customer = await retrieveCustomer().catch(() => null)
  const cart = await retrieveCart().catch(() => null)

  const [
    locales,
    currentLocale,
    categories,
    settings,
    navigationData,
  ] = await Promise.all([
    listLocales(),
    getLocale(),
    listCategories(),
    getStorefrontSettings(),
    getNavigation("header"),
  ])

  const cartCount =
    cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0

  const user: User = {
    isLoggedIn: !!customer,
    name: customer
      ? (customer.metadata?.username as string) ||
        [customer.first_name, customer.last_name]
          .filter((p) => p && p !== "null" && p !== "undefined")
          .join(" ")
          .trim() ||
        formatPhoneOrEmail(customer.email, customer.phone)
      : undefined,
    avatar: undefined,
  }

  const displayLanguage =
    currentLocale && currentLocale.toLowerCase().startsWith("en") ? "en" : "fa"

  const mapNavigationItem = (item: Record<string, any>): Record<string, any> => ({
    id: item.uiRouterKey ?? String(item.title).toLowerCase(),
    href: item.path ?? "/",
    title: item.title,
    items:
      Array.isArray(item.items) && item.items.length > 0
        ? item.items.map(mapNavigationItem)
        : undefined,
  })

  const hasStrapiNavigation = navigationData && navigationData.length > 0

  const navItems = hasStrapiNavigation
    ? navigationData.map(mapNavigationItem)
    : FALLBACK_NAV_ITEMS

  const headerStyle = settings?.header?.headerStyle ?? "style-1"
  let HeaderComponent: React.ComponentType<any>

  try {
    const importedModule = await import(`./styles/${headerStyle}`)
    HeaderComponent = importedModule.default
  } catch (error) {
    console.error(`Failed to load Header style: ${headerStyle}, falling back to style-1`, error)
    const fallbackModule = await import(`./styles/style-1`)
    HeaderComponent = fallbackModule.default
  }

  return (
    <>
      <div className="hidden small:block">
        <HeaderComponent
          language={displayLanguage}
          user={user}
          cartCount={cartCount}
          categories={categories}
          navItems={navItems}
          hasStrapiNavigation={hasStrapiNavigation}
          settings={settings}
          countryCode={countryCode}
          locales={locales}
          currentLocale={currentLocale}
          cart={cart}
        />
      </div>
      <MobileTopBar currentLocale={currentLocale ?? "fa"} settings={settings} />
    </>
  )
}

export default Header

