/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Eye } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getPricesForVariant } from "@lib/util/get-product-price"

const hasPersian = (text?: string) =>
  text ? /[\u0600-\u06FF]/.test(text) : false

interface ProductHeroProps {
  product: HttpTypes.StoreProduct
  reversed?: boolean
}

export default function ProductHero({ product, reversed = false }: ProductHeroProps) {
  const tProduct = useTranslations("Product")
  const sectionRef = useRef<HTMLDivElement>(null)

  const fullImageUrl = product.thumbnail || product.images?.[0]?.url || ""

  // Defer price formatting to client-side only to avoid SSR/client hydration mismatch.
  // On server and during initial client render, prices are null (no flash).
  const [priceInfo, setPriceInfo] =
    useState<ReturnType<typeof getPricesForVariant>>(null)
  useEffect(() => {
    const variant = product.variants?.[0]
    if (variant) setPriceInfo(getPricesForVariant(variant))
  }, [product])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const mask = section.querySelector<HTMLElement>(".color-mask")

      let progress = 0

      if (window.innerWidth < 768) {
        const elementTop = rect.top
        const startReveal = windowHeight
        const endReveal = windowHeight * 0.25

        const totalDistance = startReveal - endReveal
        const currentDistance = startReveal - elementTop

        progress = currentDistance / totalDistance
      } else {
        if (rect.top <= 0) {
          const totalScrollableDistance = rect.height - windowHeight
          if (totalScrollableDistance > 0) {
            progress = Math.abs(rect.top) / totalScrollableDistance
          }
        }
      }

      progress = Math.min(Math.max(progress, 0), 1)

      if (mask) {
        if (window.innerWidth < 768) {
          // Horizontal reveal on mobile (from left to right)
          mask.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`
        } else {
          // Vertical reveal on desktop (from bottom to top)
          mask.style.clipPath = `inset(0 0 ${100 - progress * 100}% 0)`
        }
      }

      const revealSteps = section.querySelectorAll(".reveal-step")
      revealSteps.forEach((step) => {
        const startProgress = parseFloat(
          step.getAttribute("data-progress") || "0"
        )
        if (progress > startProgress) {
          step.classList.add("active")
        } else {
          step.classList.remove("active")
        }
      })
    }

    handleScroll()

    window.addEventListener("resize", handleScroll)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("resize", handleScroll)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Extract colors and sizes from product options
  const colorOption = product.options?.find(
    (o) => o.title?.toLowerCase() === "color" || o.title === "رنگ"
  )
  const colors = colorOption?.values?.map((v) => v.value) || []

  // Build color code map from variant metadata (same logic as product-actions style-1)
  const colorCodeMap = new Map<string, string>()
  product.variants?.forEach((variant) => {
    const variantColorOpt = variant.options?.find(
      (opt) => opt.option?.title?.toLowerCase() === "color"
    )
    if (variantColorOpt?.value) {
      const colorName = variantColorOpt.value.toLowerCase()
      if (!colorCodeMap.has(colorName) && variant.metadata?.color_code) {
        colorCodeMap.set(colorName, variant.metadata.color_code as string)
      }
    }
  })

  const sizeOption = product.options?.find(
    (o) => o.title?.toLowerCase() === "size" || o.title === "سایز"
  )
  const sizes = sizeOption?.values?.map((v) => v.value) || []

  return (
    <div
      ref={sectionRef}
      className="scroll-section relative h-auto md:h-[250vh] w-full group"
    >
      <div className="relative md:sticky md:top-0 md:left-0 w-full h-auto md:h-screen overflow-hidden bg-transparent">
        <div className="w-full h-auto md:h-full grid grid-cols-1 md:grid-cols-2">
          {/* Right Side - Images (RTL: First child is Right) */}
          <div
            className={`relative w-full flex items-center justify-center p-3 sm:p-8 md:p-0 max-w-[400px] sm:max-w-[480px] md:max-w-none mx-auto ${
              reversed ? "md:order-2" : ""
            }`}
          >
            <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-full overflow-hidden rounded-2xl md:rounded-none">
              {/* Background: Grayscale Image */}
              <div className="absolute inset-0 w-full h-full flex justify-center bg-transparent">
                {fullImageUrl && (
                  <Image
                    src={fullImageUrl}
                    alt={product.title}
                    fill
                    className="object-contain grayscale brightness-110"
                    priority
                  />
                )}
              </div>

              {/* Foreground: Color Image (Clipped by clipPath) */}
              <div
                className="color-mask absolute inset-0 w-full h-full flex justify-center will-change-[clip-path]"
                style={{ clipPath: "inset(0 0 100% 0)" }}
              >
                {fullImageUrl && (
                  <Image
                    src={fullImageUrl}
                    alt={product.title}
                    fill
                    className="object-contain"
                    priority
                  />
                )}
              </div>
            </div>
          </div>

          {/* Left Side - Content (RTL: Second child is Left) */}
          <div
            className={`flex items-center justify-center py-5 px-6 md:p-12 relative z-20 ${
              reversed ? "md:order-1" : ""
            }`}
          >
            <div className="max-w-sm md:max-w-md w-full flex flex-col gap-6 md:gap-10">
              {/* Step 1: Title & Price */}
              <div
                className="reveal-step transition-all duration-1000 ease-out opacity-0 translate-y-12 [&.active]:opacity-100 [&.active]:translate-y-0"
                data-progress="0.2"
              >
                <h2 className="text-lg sm:text-xl md:text-4xl font-semibold tracking-tight text-foreground mb-3">
                  {product.title}
                </h2>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-base sm:text-xl font-medium ${
                      priceInfo?.price_type === "sale"
                        ? "text-red-500"
                        : "text-foreground"
                    }`}
                  >
                    {priceInfo?.calculated_price}
                  </span>
                  {priceInfo?.price_type === "sale" && (
                    <span className="line-through text-muted-foreground text-sm">
                      {priceInfo.original_price}
                    </span>
                  )}
                </div>
              </div>

              {/* Step 2: Description */}
              <div
                className="reveal-step transition-all duration-1000 ease-out opacity-0 translate-y-12 [&.active]:opacity-100 [&.active]:translate-y-0"
                data-progress="0.4"
              >
                <p className="text-sm md:text-base leading-relaxed text-muted-foreground font-light text-justify pt-6 border-t border-border/50">
                  {product.description || ""}
                </p>
              </div>

              {/* Step 3: Options (Colors & Sizes) */}
              {(colors.length > 0 || sizes.length > 0) && (
                <div
                  className="reveal-step grid grid-cols-2 gap-4 sm:gap-8 transition-all duration-1000 ease-out opacity-0 translate-y-12 [&.active]:opacity-100 [&.active]:translate-y-0"
                  data-progress="0.6"
                >
                  {colors.length > 0 && (
                    <div>
                      <span
                        className={`block text-[10px] text-muted-foreground uppercase mb-3 ${
                          hasPersian(tProduct("actions.color"))
                            ? "tracking-normal"
                            : "tracking-widest"
                        }`}
                      >
                        {tProduct("actions.color")}
                      </span>
                      <div className="flex gap-2.5 flex-wrap">
                        {colors.map((color, i) => {
                          const colorHex =
                            colorCodeMap.get(color?.toLowerCase() || "") ||
                            color?.toLowerCase() ||
                            "#ccc"
                          return (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full border border-border/60 shadow-sm"
                              style={{ backgroundColor: colorHex }}
                              title={color}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {sizes.length > 0 && (
                    <div>
                      <span
                        className={`block text-[10px] text-muted-foreground uppercase mb-3 ${
                          hasPersian(tProduct("actions.size"))
                            ? "tracking-normal"
                            : "tracking-widest"
                        }`}
                      >
                        {tProduct("actions.size")}
                      </span>
                      <div className="flex gap-4 text-xs font-medium text-foreground">
                        {sizes.map((size, i) => (
                          <span key={i} className="cursor-default">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Action Button */}
              <div
                className="reveal-step pt-8 transition-all duration-1000 ease-out opacity-0 translate-y-12 [&.active]:opacity-100 [&.active]:translate-y-0"
                data-progress="0.8"
              >
                <LocalizedClientLink
                  href={`/products/${product.handle}`}
                  className="w-full h-14 bg-foreground text-background text-xs font-medium hover:scale-[1.02] hover:shadow-xl transition-all duration-300 uppercase flex items-center justify-center gap-3 rounded-full"
                >
                  <span
                    className={
                      hasPersian(tProduct("quickView"))
                        ? "tracking-normal"
                        : "tracking-widest"
                    }
                  >
                    {tProduct("quickView")}
                  </span>
                  <Eye width={16} />
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
