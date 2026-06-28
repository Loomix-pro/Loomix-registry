"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "next-intl"

import { Button } from "@modules/common/components/shadcn/button"
import { Slider } from "@modules/common/components/shadcn/slider"
import { Switch } from "@modules/common/components/shadcn/switch"

interface ColorOption {
  name: string
  hex: string
}

interface FilterSidebarProps {
  categories?: HttpTypes.StoreProductCategory[]
  tags?: { id: string; value: string }[]
  availableColors?: ColorOption[]
  initialMinPrice?: number
  initialMaxPrice?: number
  currencySymbol?: string
  hideHeader?: boolean
  tomanEnabled?: boolean
}

export function FilterSidebar({
  categories = [],
  tags = [],
  availableColors = [],
  initialMinPrice = 0,
  initialMaxPrice = 500000000,
  currencySymbol = "IRR",
  hideHeader = false,
  tomanEnabled = false,
}: FilterSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("Store.filter_sidebar")

  const activeCurrencySymbol =
    currencySymbol === "IRR" && tomanEnabled ? t("toman") : currencySymbol
  const scaleFactor = currencySymbol === "IRR" && tomanEnabled ? 10 : 1
  const displayMinPrice = initialMinPrice / scaleFactor
  const displayMaxPrice = initialMaxPrice / scaleFactor
  const stepValue = currencySymbol === "IRR" && tomanEnabled ? 50000 : 500000

  const [priceRange, setPriceRange] = useState<[number, number]>([
    (Number(searchParams.get("price_min")) || initialMinPrice) / scaleFactor,
    (Number(searchParams.get("price_max")) || initialMaxPrice) / scaleFactor,
  ])

  const [onlyAvailable, setOnlyAvailable] = useState(
    searchParams.get("only_available") === "true"
  )

  useEffect(() => {
    setPriceRange([
      (Number(searchParams.get("price_min")) || initialMinPrice) / scaleFactor,
      (Number(searchParams.get("price_max")) || initialMaxPrice) / scaleFactor,
    ])
    setOnlyAvailable(searchParams.get("only_available") === "true")
  }, [searchParams, initialMinPrice, initialMaxPrice, scaleFactor])

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      })

      return newSearchParams.toString()
    },
    [searchParams]
  )

  const updateFilters = (params: Record<string, string | null>) => {
    const queryString = createQueryString(params)
    router.push(`${pathname}?${queryString}`, { scroll: false })
  }

  const toggleCategory = (categoryId: string) => {
    const currentCategories = searchParams.getAll("category_id")
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((c) => c !== categoryId)
      : [...currentCategories, categoryId]

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("category_id")
    newCategories.forEach((cat) => newSearchParams.append("category_id", cat))

    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false })
  }

  const toggleTag = (tagId: string) => {
    const currentTags = searchParams.getAll("tag_id")
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((t) => t !== tagId)
      : [...currentTags, tagId]

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("tag_id")
    newTags.forEach((tag) => newSearchParams.append("tag_id", tag))

    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false })
  }

  const toggleColor = (colorName: string) => {
    const currentColors =
      searchParams.get("color")?.split(",").filter(Boolean) ?? []
    const newColors = currentColors.includes(colorName)
      ? currentColors.filter((c) => c !== colorName)
      : [...currentColors, colorName]

    updateFilters({
      color: newColors.length > 0 ? newColors.join(",") : null,
    })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const handlePriceCommit = (value: number[]) => {
    updateFilters({
      price_min: (value[0] * scaleFactor).toString(),
      price_max: (value[1] * scaleFactor).toString(),
    })
  }

  const handleAvailabilityChange = (checked: boolean) => {
    setOnlyAvailable(checked)
    updateFilters({ only_available: checked ? "true" : null })
  }

  const resetFilters = () => {
    router.push(pathname, { scroll: false })
  }

  const currentCategories = searchParams.getAll("category_id")
  const currentTags = searchParams.getAll("tag_id")
  const currentColors =
    searchParams.get("color")?.split(",").filter(Boolean) ?? []

  const hasActiveFilters =
    currentCategories.length > 0 ||
    currentTags.length > 0 ||
    currentColors.length > 0 ||
    priceRange[1] !== initialMaxPrice ||
    onlyAvailable

  return (
    <div
      className={
        hideHeader
          ? "p-1"
          : "p-6 rounded-xl bg-card border border-border/50 sticky top-28"
      }
    >
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground rtl:text-right">
            {t("title")}
          </h3>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[10px] uppercase font-bold text-destructive hover:text-destructive/80 transition-colors"
            >
              {t("clear")}
            </button>
          )}
        </div>
      )}

      {/* Categories — Pill Tags */}
      {categories.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 rtl:text-right">
            {t("categories")}
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = currentCategories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                    isActive
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tags — Pill Tags */}
      {tags.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 rtl:text-right">
            {t("tags")}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = currentTags.includes(tag.id)
              return (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${
                    isActive
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {tag.value}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Color Swatches */}
      {availableColors.length > 0 && (
        <div className="mb-8 pt-6 border-t border-border/40">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 rtl:text-right">
            {t("colors")}
          </p>
          <div className="grid grid-cols-6 gap-2">
            {availableColors.map((color) => {
              const isActive = currentColors.includes(color.name)
              return (
                <button
                  key={color.name}
                  onClick={() => toggleColor(color.name)}
                  title={color.name}
                  className={`relative w-8 h-8 rounded-full border transition-all duration-200 group ${
                    isActive
                      ? "border-primary ring-2 ring-primary ring-offset-2 scale-110"
                      : "border-transparent ring-1 ring-inset ring-neutral-300 dark:ring-neutral-700 hover:ring-neutral-400 dark:hover:ring-neutral-500 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isActive && (
                    <svg
                      className="absolute inset-0 m-auto w-3.5 h-3.5 drop-shadow-sm"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={isLightColor(color.hex) ? "#000" : "#fff"}
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-8 pt-6 border-t border-border/40">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-5 rtl:text-right">
          {t("price_range", { currency: activeCurrencySymbol })}
        </p>
        <div className="space-y-4">
          <Slider
            dir="rtl"
            value={[priceRange[1]]}
            min={displayMinPrice}
            max={displayMaxPrice}
            step={stepValue}
            onValueChange={(val) =>
              handlePriceChange([displayMinPrice, val[0]])
            }
            onValueCommit={(val) =>
              handlePriceCommit([displayMinPrice, val[0]])
            }
            className="w-full"
          />
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            <span>
              {t("up_to", { amount: priceRange[1].toLocaleString() })}
            </span>
            <span>{displayMinPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="mb-8 pt-6 border-t border-border/40">
        <div className="flex items-center justify-between">
          <label
            htmlFor="availability-filter"
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground cursor-pointer rtl:text-right"
          >
            {t("only_available")}
          </label>
          <Switch
            id="availability-filter"
            checked={onlyAvailable}
            onCheckedChange={handleAvailabilityChange}
            className="data-[state=checked]:bg-foreground scale-90"
          />
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          onClick={resetFilters}
          variant="secondary"
          className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-muted hover:bg-muted/80 text-foreground transition-colors"
        >
          {t("clear_filters")}
        </Button>
      )}
    </div>
  )
}

/** Helper to determine if a hex color is light (for checkmark contrast) */
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "")
  if (c.length !== 6) return false
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155
}
