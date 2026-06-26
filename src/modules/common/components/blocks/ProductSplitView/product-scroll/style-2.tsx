/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { ArrowDown } from "lucide-react"
import ProductCardDeck from "@/modules/common/components/aicanvas/product-card-deck"

const hasPersian = (text?: string) =>
  text ? /[\u0600-\u06FF]/.test(text) : false

function ProductCard({
  product,
  index,
  tHome,
}: {
  product: any
  index: number
  tHome: any
}) {
  const stickyTop = `${100 + index * 40}px`
  const cardZIndex = 10 + index

  const imageUrl = product.thumbnail || product.images?.[0]?.url
  const prodTitle = product.title
  const prodDesc = product.description
  const collTitle =
    product.collection?.title || product.collection || "CLOSET STUDIO"

  const colorCodeMap = new Map<string, string>()
  product.variants?.forEach((variant: any) => {
    const colorOption = variant.options?.find(
      (opt: any) =>
        opt.title?.toLowerCase() === "color" ||
        opt.title === "رنگ" ||
        opt.option?.title?.toLowerCase() === "color"
    )
    if (colorOption?.value) {
      const colorValue = colorOption.value.toLowerCase()
      const metadata = variant.metadata || variant.user_metadata
      if (!colorCodeMap.has(colorValue) && metadata?.color_code) {
        colorCodeMap.set(colorValue, metadata.color_code as string)
      }
    }
  })

  const [priceText, setPriceText] = useState<string>(product.price || "")

  useEffect(() => {
    if (product.variants?.[0]) {
      const priceInfo = getPricesForVariant(product.variants[0])
      if (priceInfo?.calculated_price) {
        setPriceText(priceInfo.calculated_price)
      }
    }
  }, [product])

  return (
    <div
      style={{
        top: stickyTop,
        zIndex: cardZIndex,
      }}
      className="sticky w-full rounded-3xl border border-border/60 bg-background/95 backdrop-blur-md shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden mb-16 transition-all duration-500 hover:shadow-[0_0_50px_-15px_rgba(0,0,0,0.15)] group"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px] md:h-[65vh] max-h-[750px]">
        {/* Image side */}
        <div className="relative md:col-span-6 h-[350px] md:h-full overflow-hidden bg-muted/10">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={prodTitle}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>

        {/* Content side */}
        <div
          className="md:col-span-6 flex flex-col justify-center p-8 md:p-12 lg:p-16 h-full relative"
          dir="rtl"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="inline-flex px-3 py-1 bg-primary/5 rounded-full text-[11px] font-semibold text-primary border border-primary/10 tracking-widest">
              {collTitle}
            </span>
            <span className="text-xl font-light text-muted-foreground/30 font-serif tabular-nums">
              0{index + 1}
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground leading-tight mb-4 tracking-tight">
            {prodTitle}
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed font-light mb-8 line-clamp-3">
            {prodDesc}
          </p>

          {/* Options / Variants */}
          {product.options && product.options.length > 0 && (
            <div className="flex flex-col gap-5 mb-8 bg-muted/5 p-4 rounded-2xl border border-border/40">
              {product.options.map((option: any) => {
                const uniqueValues = Array.from(
                  new Set(option.values?.map((v: any) => v.value || v) || [])
                )
                return (
                  <div key={option.id || option.title} className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-3 bg-primary/40 rounded-full"></div>
                      <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                        {option.title}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uniqueValues.map((val: any, i: number) => {
                        const isColorOption =
                          option.title?.toLowerCase() === "color" ||
                          option.title === "رنگ"
                        let hexColor = val
                        let displayName = val

                        if (typeof val === "string" && val.includes("::")) {
                          const parts = val.split("::")
                          displayName = parts[0]
                          hexColor = parts[1]
                        }

                        if (isColorOption) {
                          const colorNameLower = displayName.toLowerCase()
                          const finalColor =
                            colorCodeMap.get(colorNameLower) ||
                            hexColor ||
                            "#ccc"
                          return (
                            <span
                              key={i}
                              title={displayName}
                              className="w-6 h-6 rounded-full border border-black/10 shadow-sm hover:scale-110 transition-transform duration-200 cursor-default"
                              style={{ backgroundColor: finalColor }}
                            />
                          )
                        }

                        return (
                          <span
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-background border border-border hover:border-foreground/30 rounded-lg text-foreground/80 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none uppercase"
                          >
                            <span>{displayName}</span>
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-auto pt-8 border-t border-border/40 flex items-center justify-between">
            <span className="text-lg md:text-xl font-medium tracking-wide">
              {priceText}
            </span>
            <LocalizedClientLink
              href={`/products/${product.handle || "#"}`}
              className="px-6 py-3 bg-foreground text-background rounded-full text-xs font-semibold tracking-widest hover:bg-primary transition-colors hover:scale-[1.02] duration-300"
            >
              {tHome("view_product")}
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Style2({
  products = [],
  title,
  subtitle,
  description,
  buttonText,
  buttonLink = "#",
}: ScrollStageProps) {
  const tHome = useTranslations("HomePage")
  const finalTitle = title || tHome("sticky_stack")
  const finalSubtitle = subtitle || tHome("season_picks")
  const finalDescription = description || tHome("style2_desc")
  const finalButtonText = buttonText || tHome("view_collection")

  if (!products || products.length === 0) return null

  const displayProducts = products

  return (
    <div className="w-full bg-transparent relative py-16 md:py-24 px-0 sm:px-6 md:px-8 font-sans selection:bg-primary/20 selection:text-foreground">
      {/* Header section */}
      <div className="max-w-5xl mx-auto mb-10 md:mb-16 text-center space-y-4 px-4 sm:px-0">
        <span className="text-[10px] md:text-xs font-bold tracking-widest text-muted-foreground uppercase">
          {finalSubtitle}
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
          {finalTitle}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {finalDescription}
        </p>
      </div>

      {/* Mobile View: Product Card Deck */}
      <ProductCardDeck
        products={displayProducts}
        buttonText={finalButtonText}
        buttonLink={buttonLink}
      />

      {/* Desktop View: Sticky Stack Container */}
      <div className="hidden md:block max-w-5xl mx-auto relative pb-32">
        {displayProducts.map((product: any, index: number) => (
          <ProductCard
            key={product.id || index}
            product={product}
            index={index}
            tHome={tHome}
          />
        ))}
      </div>

      {/* CTA Button */}
      {finalButtonText && (
        <div className="hidden md:flex justify-center mb-8 relative z-20">
          <div className="glow-container rounded-full inline-block">
            <LocalizedClientLink
              href={buttonLink || "#"}
              className="btn-shine relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-10 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] group"
            >
              <span
                className={`relative z-10 uppercase ${
                  hasPersian(finalButtonText)
                    ? "tracking-normal"
                    : "tracking-widest"
                }`}
              >
                {finalButtonText}
              </span>
              <ArrowDown
                className="relative z-10 rotate-90 transition-transform group-hover:-translate-x-1"
                width={18}
              />
            </LocalizedClientLink>
          </div>
        </div>
      )}
    </div>
  )
}
