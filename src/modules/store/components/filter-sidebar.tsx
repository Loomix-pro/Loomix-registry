"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "next-intl"

import { Button } from "@modules/common/components/shadcn/button"
import { Slider } from "@modules/common/components/shadcn/slider"
import { Switch } from "@modules/common/components/shadcn/switch"
import { Search, ChevronDown, Check, X } from "lucide-react"

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
    // Always reset to page 1 when any filter changes,
    // otherwise filtered results may be empty if user was on a later page.
    const queryString = createQueryString({ ...params, page: null })
    window.dispatchEvent(new Event("store-loading-start"))
    router.push(`${pathname}?${queryString}`, { scroll: false })
  }

  const toggleCategory = (categoryId: string) => {
    const currentCategories = searchParams.getAll("category_id")
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((c) => c !== categoryId)
      : [...currentCategories, categoryId]

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("category_id")
    newSearchParams.delete("page") // Reset to page 1 on filter change
    newCategories.forEach((cat) => newSearchParams.append("category_id", cat))

    window.dispatchEvent(new Event("store-loading-start"))
    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false })
  }

  const toggleTag = (tagId: string) => {
    const currentTags = searchParams.getAll("tag_id")
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((t) => t !== tagId)
      : [...currentTags, tagId]

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("tag_id")
    newSearchParams.delete("page") // Reset to page 1 on filter change
    newTags.forEach((tag) => newSearchParams.append("tag_id", tag))

    window.dispatchEvent(new Event("store-loading-start"))
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
    window.dispatchEvent(new Event("store-loading-start"))
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

      {/* Categories — Multi-select Search */}
      {categories.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 rtl:text-right">
            {t("categories")}
          </p>
          <SearchableMultiSelect
            options={categories.map((c) => ({ id: c.id, label: c.name }))}
            selectedValues={currentCategories}
            onToggle={toggleCategory}
            placeholder={t("categories")}
          />
        </div>
      )}

      {/* Tags — Multi-select Search */}
      {tags.length > 0 && (
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 rtl:text-right">
            {t("tags")}
          </p>
          <SearchableMultiSelect
            options={tags.map((t) => ({ id: t.id, label: t.value }))}
            selectedValues={currentTags}
            onToggle={toggleTag}
            placeholder={t("tags")}
          />
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

function SearchableMultiSelect({
  options,
  selectedValues,
  onToggle,
  placeholder = "Select...",
}: {
  options: { id: string; label: string }[]
  selectedValues: string[]
  onToggle: (id: string) => void
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[44px] w-full bg-background border border-border/50 rounded-xl p-2 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors"
      >
        <div className="flex flex-wrap gap-1.5 flex-1 items-center rtl:space-x-reverse">
          {selectedValues.length === 0 && (
            <span className="text-muted-foreground/60 text-xs px-2 font-medium">
              {placeholder}
            </span>
          )}
          {selectedValues.map((val) => {
            const label = options.find((o) => o.id === val)?.label || val
            return (
              <span
                key={val}
                className="bg-foreground text-background text-[10px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle(val)
                }}
              >
                {label}
                <X className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100" />
              </span>
            )
          })}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground ml-2 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col max-h-60 animate-in fade-in slide-in-from-top-2">
          <div className="p-2.5 border-b border-border/30 flex items-center gap-2.5 bg-muted/20">
            <Search className="w-4 h-4 text-muted-foreground/60" />
            <input
              className="bg-transparent border-none outline-none text-xs w-full text-foreground placeholder:text-muted-foreground/50"
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1.5">
            {filteredOptions.length === 0 && (
              <div className="p-4 text-center text-xs text-muted-foreground/60">
                نتیجه‌ای یافت نشد
              </div>
            )}
            {filteredOptions.map((opt) => {
              const isSelected = selectedValues.includes(opt.id)
              return (
                <div
                  key={opt.id}
                  onClick={() => onToggle(opt.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg text-xs cursor-pointer transition-colors mb-0.5 ${
                    isSelected
                      ? "bg-primary/10 text-primary font-bold"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
