"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Store, ShoppingCart, User, LayoutGrid } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"
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
      href: "/categories",
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
        "bg-slate-900/90 dark:bg-slate-50/90 backdrop-blur-2xl border border-slate-800/40 dark:border-slate-200/40 flex small:hidden items-center justify-around p-1.5 shadow-2xl shadow-indigo-900/20 w-[95%] mx-auto min-h-[64px] rounded-full",
        stickyBottom && "fixed left-0 right-0 bottom-4 z-50",
        className
      )}
    >
      {navItems.map((item, _idx) => {
        const Icon = item.icon

        // Simple logic to check active route
        const isActive =
          item.href === "/"
            ? pathname === "/" || /^\/[a-zA-Z]{2}$/.test(pathname)
            : pathname.includes(item.href.split("?")[0])

        const buttonContent = (
          <motion.button
            whileTap={{ scale: 0.92 }}
            className={cn(
              "flex items-center justify-center gap-0 px-3 py-2 rounded-full transition-all duration-300 relative h-12 w-full",
              isActive
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 gap-2 scale-105"
                : "bg-transparent text-slate-400 hover:text-slate-200 dark:text-slate-500 dark:hover:text-slate-700",
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
                <span className="absolute -top-1.5 ltr:-right-2 ltr:left-auto rtl:-left-2 rtl:right-auto flex items-center justify-center min-w-[16px] h-[16px] rounded-full bg-ui-bg-interactive text-ui-fg-on-inverted text-[9px] font-bold px-1 ring-2 ring-ui-bg-base">
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
                  isActive ? "text-white" : "opacity-0"
                )}
                title={item.label}
              >
                {item.label}
              </span>
            </motion.div>
          </motion.button>
        )

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
