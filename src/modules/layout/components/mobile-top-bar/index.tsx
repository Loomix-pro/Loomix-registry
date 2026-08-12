"use client"

import { useTransition, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Languages, Sun, Moon } from "lucide-react"
import { updateLocale } from "@lib/data/locale-actions"
import { dispatchLocaleChange } from "@lib/i18n/locale-change-event"
import { Button } from "@modules/common/components/shadcn/button"
import { useThemeToggle } from "@lib/hooks/use-theme-toggle"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"
import SearchExperience from "@modules/common/components/search"

/**
 * MobileTopBar Component
 *
 * Renders a sticky top navigation bar specifically tailored for mobile viewports.
 * It provides quick access to the logo, search, theme toggling, and language switching.
 *
 * @param currentLocale - The current active language locale (e.g., 'en', 'fa')
 * @param settings - Optional site settings containing configurations like logo
 * @returns React Component for the mobile top bar
 */
export default function MobileTopBar({
  currentLocale,
  settings,
}: {
  currentLocale: string
  settings?: any
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toggleTheme, resolvedTheme } = useThemeToggle()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMobileLanguageToggle = () => {
    startTransition(async () => {
      const nextLocale =
        currentLocale === "en" || currentLocale === "default" ? "fa" : "en"
      await updateLocale(nextLocale)
      dispatchLocaleChange(nextLocale)
      router.refresh()
    })
  }

  const STRAPI_URL =
    process.env.STRAPI_URL ||
    process.env.STRAPI_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337"

  const getLogo = () => {
    const logoLight = settings?.header?.logoLight
    const logoDark = settings?.header?.logoDark

    if (!logoLight && !logoDark)
      return <span className="font-bold text-lg">Logo</span>

    const renderLogo = (logoConfig: any, isDark: boolean) => {
      if (!logoConfig) return null

      if (logoConfig.type === "text" && logoConfig.text) {
        return (
          <span
            className={cn(
              "text-[18px] font-bold tracking-[2px] no-underline bg-[linear-gradient(135deg,#e8c547,#c8a96e,#f0d080,#a07840,#e8c547)] [background-size:200%_auto] bg-clip-text text-transparent animate-shimmer font-['Courier_New',monospace] relative",
              isDark ? "hidden dark:block" : "dark:hidden"
            )}
          >
            {logoConfig.text}
          </span>
        )
      }

      if (logoConfig.type === "image" && logoConfig.image) {
        let imageUrl = ""
        const img = logoConfig.image

        if ("data" in img && img.data?.attributes?.url) {
          imageUrl = img.data.attributes.url
        } else if ("url" in img && img.url) {
          imageUrl = img.url
        }

        if (imageUrl) {
          if (!imageUrl.startsWith("http")) {
            imageUrl = `${STRAPI_URL}${imageUrl}`
          }
          return (
            <Image
              src={imageUrl}
              alt="Logo"
              width={120}
              height={32}
              className={cn(
                "h-8 w-auto object-contain",
                isDark ? "hidden dark:block" : "dark:hidden"
              )}
            />
          )
        }
      }
      return null
    }

    return (
      <div className="flex items-center">
        {renderLogo(logoLight, false)}
        {renderLogo(logoDark, true)}
      </div>
    )
  }

  return (
    <div className="flex small:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-50 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Logo */}
      <LocalizedClientLink href="/" className="flex items-center shrink-0">
        {getLogo()}
      </LocalizedClientLink>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <SearchExperience
          indexName={
            process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME || "products"
          }
          iconOnly={true}
          attributes={{
            primaryText: "title",
            secondaryText: "description",
            image: "thumbnail",
            url: "url",
          }}
          transformItems={(items) =>
            items.map((hit: any) => ({
              ...hit,
              url: `/products/${hit.handle}`,
            }))
          }
        />
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
          aria-label="Toggle Theme"
        >
          {mounted ? (
            resolvedTheme === "light" ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )
          ) : (
            <div className="w-[18px] h-[18px]" />
          )}
        </Button>

        {/* Language Toggle */}
        <Button
          onClick={handleMobileLanguageToggle}
          disabled={isPending}
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
          aria-label="Toggle Language"
        >
          <Languages size={18} />
        </Button>
      </div>
    </div>
  )
}
