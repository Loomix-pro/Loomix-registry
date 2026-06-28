"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getProductPrice } from "@lib/util/get-product-price"
import { getProductReviews } from "@lib/data/products"
import { getActiveSettings } from "@lib/util/money"
import { useTranslations, useLocale } from "next-intl"
import { useDictionary } from "@modules/common/components/dictionary-provider"
import { Eye, Flame, Star } from "lucide-react"

interface ProductCard1Props {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

export default function ProductCard1({ product }: ProductCard1Props) {
  const t = useTranslations("Product.cards")
  const tPrice = useTranslations("Product.price")
  const tInfo = useTranslations("Product.info")
  const translate = useDictionary()
  const [selectedVariant, setSelectedVariant] = useState<
    HttpTypes.StoreProductVariant | undefined
  >(product.variants?.[0])
  const [views, setViews] = useState<number | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [isBadgeHovered, setIsBadgeHovered] = useState(false)

  useEffect(() => {
    if (!product.handle) return

    fetch(`/api/views?handle=${product.handle}`)
      .then((res) => res.json())
      .then((data) => setViews(data.views ?? 0))
      .catch((err) => console.error("Error fetching views:", err))

    getProductReviews({ productId: product.id, limit: 1 })
      .then((data) => {
        if (data && data.average_rating > 0) {
          setRating(data.average_rating)
        }
      })
      .catch((err) => console.error("Error fetching rating:", err))
  }, [product.handle, product.id])

  // Get main image - use variant thumbnail, variant's first image, or product thumbnail
  const mainImageUrl =
    selectedVariant?.thumbnail ||
    selectedVariant?.images?.[0]?.url ||
    product.thumbnail ||
    product.images?.[0]?.url ||
    "/placeholder.png"

  const locale = useLocale()
  const settings = getActiveSettings()
  // Get price info using Medusa's utility function
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: selectedVariant?.id,
    locale,
    settings,
  })

  const hasRating = rating !== null

  const priceInfo = variantPrice || cheapestPrice

  const isPriceRange =
    !selectedVariant &&
    product.variants?.some(
      (v: any) =>
        v.calculated_price &&
        cheapestPrice &&
        v.calculated_price.calculated_amount >
          cheapestPrice.calculated_price_number
    )

  const discountPercentage = priceInfo?.percentage_diff
    ? Math.abs(Math.round(Number(priceInfo.percentage_diff)))
    : 0

  // Build a color code map from all variants metadata
  const colorCodeMap = new Map<string, string>()
  product.variants?.forEach((variant) => {
    const colorOption = variant.options?.find(
      (opt: any) =>
        opt.title?.toLowerCase() === "color" ||
        opt.option?.title?.toLowerCase() === "color"
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
    if (opt.title?.toLowerCase() === "color") {
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

  // Extract all unique non-color options for display (e.g., Size, Material, etc.)
  const otherOptions =
    product.options?.reduce((acc, opt: any) => {
      const optionTitle = opt.title?.toLowerCase()
      if (
        !optionTitle ||
        optionTitle === "color" ||
        optionTitle === "default option"
      )
        return acc

      const optionName = opt.title

      const values = opt.value
        ? [opt.value]
        : opt.values?.map((v: any) => v.value) || []

      values.forEach((originalValue: string) => {
        if (!originalValue) return

        const optionValue = originalValue.toLowerCase()
        if (optionValue === "default option value") return

        // Find or create option group
        let optionGroup = acc.find((g: any) => g.name === optionName)
        if (!optionGroup) {
          optionGroup = { name: optionName, values: [] }
          acc.push(optionGroup)
        }

        // Add unique values only
        if (!optionGroup.values.includes(originalValue)) {
          optionGroup.values.push(originalValue)
        }
      })

      return acc
    }, [] as Array<{ name: string; values: string[] }>) || []

  return (
    <div className="group w-full rounded-2xl bg-background cursor-pointer overflow-hidden shadow-sm relative border border-gray-200 dark:border-gray-800 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
      {/* IMAGE */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg transform -rotate-2">
            {t("off", { percentage: discountPercentage })}
          </div>
        )}

        {hasRating && (
          <div className="absolute top-3 right-3 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-300">
            <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            <span>{Number(rating).toFixed(1)}</span>
          </div>
        )}

        {/* Umami Views Count Badge */}
        {views === null ? (
          <div className="absolute bottom-3 right-3 z-20 bg-white/70 dark:bg-black/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 text-gray-400 text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm animate-pulse">
            <Eye className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
            <div className="w-6 h-2 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"></div>
          </div>
        ) : (
          views > 0 && (
            <div
              className="absolute bottom-3 right-3 z-20 cursor-default"
              onMouseEnter={() => setIsBadgeHovered(true)}
              onMouseLeave={() => setIsBadgeHovered(false)}
            >
              <div
                className={`backdrop-blur-md border shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-semibold transition-all duration-300 ${
                  views >= 50
                    ? "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-amber-500/5 hover:border-amber-500/50 hover:bg-amber-500/20"
                    : "bg-white/80 dark:bg-slate-900/80 border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                } ${isBadgeHovered ? "scale-105 shadow-md" : ""}`}
              >
                {views >= 50 ? (
                  <Flame
                    className={`w-3.5 h-3.5 text-amber-500 fill-amber-500 ${
                      isBadgeHovered ? "animate-bounce" : "animate-pulse"
                    }`}
                  />
                ) : (
                  <Eye
                    className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
                      isBadgeHovered ? "scale-110 text-primary" : ""
                    }`}
                  />
                )}
                <span>{views.toLocaleString()}</span>
              </div>
              {/* Tooltip */}
              <div
                className={`absolute bottom-full right-1/2 translate-x-1/2 mb-2 px-2 py-1 bg-slate-950/95 dark:bg-slate-900/95 text-white dark:text-slate-200 text-[9px] font-medium rounded-md shadow-lg border border-slate-800 transition-all duration-200 whitespace-nowrap z-30 ${
                  isBadgeHovered
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-1 pointer-events-none"
                }`}
              >
                {views >= 50 ? tInfo("popular_product") : tInfo("views_count")}
              </div>
            </div>
          )
        )}

        <LocalizedClientLink
          href={`/products/${product.handle}`}
          className="block w-full h-full relative"
        >
          <Image
            src={mainImageUrl}
            alt={product.title || t("product_alt")}
            fill
            sizes="(max-width: 600px) 100vw, 350px"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </LocalizedClientLink>
      </div>

      {/* BODY */}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex flex-col gap-0.5 items-center text-center">
          <LocalizedClientLink
            href={`/products/${product.handle}`}
            className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
            title={product.title}
          >
            {product.title}
          </LocalizedClientLink>

          {/* Price - Minimal display */}
          <div className="flex justify-center items-center gap-1.5">
            {priceInfo?.price_type === "sale" && (
              <span className="line-through text-gray-400 text-xs">
                {priceInfo.original_price}
              </span>
            )}
            <span
              className={`text-sm font-semibold ${
                priceInfo?.price_type === "sale"
                  ? "text-red-500"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {isPriceRange ? tPrice("from") : ""}
              {priceInfo ? priceInfo.calculated_price : "N/A"}
            </span>
          </div>
        </div>

        {/* Color Swatches - Minimal */}
        {uniqueColors && uniqueColors.length > 0 && (
          <div className="flex justify-center gap-1.5 pt-1.5 flex-wrap min-h-[20px]">
            {uniqueColors.slice(0, 5).map((colorOption: any, index: number) => {
              const colorName = colorOption?.value?.toLowerCase() || ""
              // Check map first for metadata-defined hex code, fallback to color name, then #ccc
              const colorValue =
                colorCodeMap.get(colorName) || colorName || "#ccc"

              const isSelected = selectedVariant?.options?.some(
                (opt: any) =>
                  (opt.title?.toLowerCase() === "color" ||
                    opt.option?.title?.toLowerCase() === "color") &&
                  opt.value?.toLowerCase() === colorName
              )

              return (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    // Find first variant that has this color
                    const matchingVariant = product.variants?.find((v) => {
                      return v.options?.some(
                        (opt: any) =>
                          (opt.title?.toLowerCase() === "color" ||
                            opt.option?.title?.toLowerCase() === "color") &&
                          opt.value?.toLowerCase() === colorName
                      )
                    })
                    if (matchingVariant) setSelectedVariant(matchingVariant)
                  }}
                  className={`w-4 h-4 rounded-full border shadow-sm transition-all duration-200 hover:scale-110 hover:shadow-sm ${
                    isSelected
                      ? "ring-2 ring-primary ring-offset-1 border-transparent"
                      : "border-gray-200"
                  }`}
                  style={{
                    backgroundColor: colorValue,
                  }}
                  title={translate(colorOption?.value)}
                />
              )
            })}
          </div>
        )}

        {/* Other Variant Options - Minimal Badge */}
        {otherOptions && otherOptions.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-2.5 border-t border-gray-100 dark:border-gray-800 mt-0.5">
            {otherOptions.map((option) => (
              <div
                key={option.name}
                className="flex items-center justify-center gap-1.5"
              >
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">
                  {translate(option.name)}:
                </span>
                <div className="flex gap-1 flex-wrap justify-center">
                  {option.values.map((value) => (
                    <span
                      key={value}
                      className="px-1.5 py-[2px] bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded text-[10px] text-gray-500 dark:text-gray-400 leading-none"
                    >
                      {translate(value)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
