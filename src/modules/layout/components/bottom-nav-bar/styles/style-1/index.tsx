"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Store, ShoppingCart, User, LayoutGrid } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "lib/utils"
import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@modules/common/components/shadcn/sheet"
import { MobileNavigationItem } from "@modules/layout/components/header/navigation-item"
import { CategoryMenu } from "@modules/layout/components/header/category-menu"

// baseNavItems moved inside component to use translations


import { BottomNavBarProps } from "../../index"

export function BottomNavBar({
  className,
  stickyBottom = true,
  cart,
  hasCategories = false,
  categories = [],
  navigationData = null,
}: BottomNavBarProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations("Layout.nav")

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const hasStrapiNavigation = navigationData && navigationData.length > 0
  const showCategoriesTab = hasStrapiNavigation || hasCategories

  // Dynamically add categories if available
  const baseNavItems = [
    { id: "home", label: t("home"), icon: Home, href: "/" },
    { id: "store", label: t("store"), icon: Store, href: "/store" },
    { id: "cart", label: t("cart"), icon: ShoppingCart, href: "/cart" },
    { id: "account", label: t("account"), icon: User, href: "/account" },
  ]

  const navItems = [...baseNavItems]
  if (showCategoriesTab) {
    navItems.splice(1, 0, {
      id: "categories",
      label: t("categories"),
      icon: LayoutGrid,
      href: "#",
    })
  }

  const mapNavigationItem = (item: any): any => ({
    id: item.uiRouterKey || item.title?.toLowerCase() || item.id,
    href: item.path || "/",
    title: item.title,
    items:
      item.items && item.items.length > 0
        ? item.items.map(mapNavigationItem)
        : undefined,
  })

  const mappedNavItems = hasStrapiNavigation
    ? navigationData.map(mapNavigationItem)
    : []

  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        "bg-white/70 dark:bg-neutral-950/70 backdrop-blur-2xl border-t border-white/40 dark:border-neutral-800 flex small:hidden items-center p-2 shadow-[0_-8px_30px_rgb(0,0,0,0.12)] w-full min-h-[64px]",
        stickyBottom && "fixed inset-x-0 bottom-0 z-50",
        className
      )}
    >
      {navItems.map((item, _idx) => {
        const Icon = item.icon

        // Simple logic to check active route
        const isActive =
          item.href === "/"
            ? pathname === "/" || pathname.split("/").length === 2
            : pathname.includes(item.href.split("?")[0]) &&
              item.id !== "categories" // Avoid duplicate active state if both point to /store

        const buttonContent = (
          <motion.button
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex items-center justify-center gap-0 px-3 py-2 rounded-full transition-all duration-300 relative h-12 w-full",
              isActive
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-md gap-2"
                : "bg-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800",
              "focus:outline-none focus-visible:ring-0"
            )}
            aria-label={item.label}
            type="button"
          >
            <div className="relative flex items-center justify-center">
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                aria-hidden
                className="transition-colors duration-300"
              />
              {item.href === "/cart" && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[16px] h-[16px] rounded-full bg-ui-bg-interactive text-ui-fg-on-inverted text-[9px] font-bold px-1 ring-2 ring-ui-bg-base">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>

            <motion.div
              initial={false}
              animate={{
                width: isActive ? "auto" : "0px",
                opacity: isActive ? 1 : 0,
                marginLeft: isActive ? "6px" : "0px",
              }}
              transition={{
                width: { type: "spring", stiffness: 350, damping: 30 },
                opacity: { duration: 0.2 },
                marginLeft: { duration: 0.2 },
              }}
              className={cn("overflow-hidden flex items-center")}
            >
              <span
                className={cn(
                  "font-semibold text-[11px] whitespace-nowrap select-none transition-opacity duration-300",
                  isActive ? "text-white dark:text-neutral-900" : "opacity-0"
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        )

        if (item.id === "categories") {
          return (
            <Sheet
              key={item.label}
              open={isMenuOpen}
              onOpenChange={setIsMenuOpen}
            >
              <SheetTrigger asChild>
                <div className="flex-1 flex justify-center cursor-pointer">
                  {buttonContent}
                </div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-white dark:bg-neutral-950 p-4 w-full sm:max-w-md h-full overflow-y-auto z-[100] border-l border-neutral-100 dark:border-neutral-800"
              >
                <SheetHeader className="mb-3">
                  <SheetTitle className="text-right text-base font-semibold">
                    {t("categories")}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 pb-6 mt-4">
                  {hasStrapiNavigation ? (
                    mappedNavItems.map((navItem: any) => (
                      <MobileNavigationItem
                        key={navItem.id}
                        item={navItem}
                        t={t}
                        setIsMenuOpen={setIsMenuOpen}
                        isRtl={true}
                      />
                    ))
                  ) : (
                    <CategoryMenu
                      categories={categories}
                      mobile={true}
                      setIsOpen={setIsMenuOpen}
                      language="fa"
                      hideTitle={true}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )
        }

        return (
          <LocalizedClientLink
            href={item.href}
            key={item.label}
            passHref
            className="flex-1 flex justify-center"
          >
            {buttonContent}
          </LocalizedClientLink>
        )
      })}
    </motion.nav>
  )
}

export default BottomNavBar
