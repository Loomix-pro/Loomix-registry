"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { useDictionary } from "@modules/common/components/dictionary-provider"

interface ProductColorsProps {
  product: HttpTypes.StoreProduct
  selectedVariant?: HttpTypes.StoreProductVariant | undefined
  onSelectVariant?: (variant: HttpTypes.StoreProductVariant) => void
  limit?: number
  size?: "sm" | "md" | "lg"
  className?: string
  showCount?: boolean
}

export default function ProductColors({
  product,
  selectedVariant,
  onSelectVariant,
  limit,
  size = "sm",
  className = "flex justify-center gap-1.5 flex-wrap min-h-[20px]",
  showCount = false,
}: ProductColorsProps) {
  const translate = useDictionary()

  // Build a color code map from all variants metadata
  const colorCodeMap = new Map<string, string>()
  product.variants?.forEach((variant) => {
    const colorOption = variant.options?.find(
      (opt: any) =>
        opt.title?.toLowerCase() === "color" ||
        opt.option?.title?.toLowerCase() === "color" ||
        opt.title === "رنگ" ||
        opt.option?.title === "رنگ"
    )
    if (colorOption?.value) {
      const colorValue = colorOption.value.toLowerCase()
      // Some API versions put metadata on variant, some might have it elsewhere, we check variant.metadata
      const metadata = variant.metadata || (variant as any).user_metadata
      if (!colorCodeMap.has(colorValue) && metadata?.color_code) {
        colorCodeMap.set(colorValue, metadata.color_code as string)
      }
    }
  })

  // Extract color swatches handling both Meilisearch flattened options AND standard Medusa API options
  const uniqueColorsMap = new Map<string, any>()
  product.options?.forEach((opt: any) => {
    if (opt.title?.toLowerCase() === "color" || opt.title === "رنگ") {
      const values = opt.value ? [opt] : opt.values || []
      values.forEach((v: any) => {
        const colorValue = v.value
        if (colorValue && !uniqueColorsMap.has(colorValue)) {
          uniqueColorsMap.set(colorValue, {
            title: opt.title,
            value: colorValue,
          })
        }
      })
    }
  })
  
  const uniqueColors = Array.from(uniqueColorsMap.values())

  if (!uniqueColors || uniqueColors.length === 0) {
    return null
  }

  const displayedColors = limit ? uniqueColors.slice(0, limit) : uniqueColors

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className={className}>
      {displayedColors.map((colorOption: any, index: number) => {
        const colorName = colorOption?.value?.toLowerCase() || ""
        // Check map first for metadata-defined hex code, fallback to color name, then #ccc
        const colorValue = colorCodeMap.get(colorName) || colorName || "#ccc"

        const isSelected = selectedVariant?.options?.some(
          (opt: any) =>
            (opt.title?.toLowerCase() === "color" ||
              opt.option?.title?.toLowerCase() === "color" ||
              opt.title === "رنگ" ||
              opt.option?.title === "رنگ") &&
            opt.value?.toLowerCase() === colorName
        )

        const isInteractive = !!onSelectVariant

        return (
          <button
            key={index}
            onClick={(e) => {
              if (!isInteractive) return
              e.preventDefault()
              // Find first variant that has this color
              const matchingVariant = product.variants?.find((v) => {
                return v.options?.some(
                  (opt: any) =>
                    (opt.title?.toLowerCase() === "color" ||
                      opt.option?.title?.toLowerCase() === "color" ||
                      opt.title === "رنگ" ||
                      opt.option?.title === "رنگ") &&
                    opt.value?.toLowerCase() === colorName
                )
              })
              if (matchingVariant) onSelectVariant(matchingVariant)
            }}
            className={`${sizeClasses[size]} rounded-full border shadow-sm transition-all duration-200 ${
              isInteractive
                ? "hover:scale-110 hover:shadow-sm cursor-pointer"
                : "cursor-default"
            } ${
              isSelected
                ? "ring-2 ring-primary ring-offset-1 border-transparent"
                : "border-border"
            }`}
            style={{
              backgroundColor: colorValue,
            }}
            title={translate(colorOption?.value)}
            disabled={!isInteractive}
          />
        )
      })}
      {showCount && uniqueColors.length > limit! && (
        <span className="text-[10px] text-muted-foreground flex items-center ml-1">
          +{uniqueColors.length - limit!}
        </span>
      )}
    </div>
  )
}
