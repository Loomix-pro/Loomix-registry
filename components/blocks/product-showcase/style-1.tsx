/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import React, { useRef, useState, useEffect } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  ArrowRight,
  ArrowLeft,
  Flame,
  Percent,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getProductPrice } from "@lib/util/get-product-price"
import { useTranslations, useLocale } from "next-intl"

function ProductShowcaseCard({ product }: { product: any }) {
  const [isHovered, setIsHovered] = useState(false)
  const t = useTranslations("HomePage")

  let priceInfo: any = null
  if (product?.variants?.length) {
    try {
      const { cheapestPrice } = getProductPrice({ product })
      priceInfo = cheapestPrice
    } catch (e) {
      console.error("Error getting product price:", e)
    }
  }

  const id = product.id
  const productTitle = product.title
  const handle = product.handle
  const thumbnail =
    product.thumbnail ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop"
  const category =
    product.category ||
    product.categories?.[0]?.name ||
    t("showcase.default_category")

  const priceText = priceInfo
    ? priceInfo.calculated_price
    : product.price
    ? `${product.price}`
    : ""
  const originalPriceText = priceInfo?.original_price || product.originalPrice
  const isSale = priceInfo
    ? priceInfo.price_type === "sale"
    : !!product.originalPrice

  const rawDiscount = priceInfo?.percentage_diff || product.discount
  const discount =
    rawDiscount &&
    rawDiscount !== "0" &&
    rawDiscount !== "0%" &&
    rawDiscount !== 0
      ? String(rawDiscount).endsWith("%")
        ? rawDiscount
        : `${rawDiscount}%`
      : null

  return (
    <LocalizedClientLink
      href={`/products/${handle}`}
      draggable={false}
      className="relative group snap-center flex-shrink-0 w-[200px] sm:w-[260px] md:w-[320px] h-[320px] sm:h-[380px] md:h-[440px] rounded-[2rem] overflow-hidden cursor-pointer bg-background/5 border border-border/40 hover:border-primary/30 transition-all duration-700 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] block select-none touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 z-0 bg-muted/10 rounded-[inherit] overflow-hidden [transform:translateZ(0)]">
        <Image
          src={thumbnail}
          alt={productTitle}
          fill
          draggable={false}
          className={`object-cover transition-transform duration-1000 ease-out ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          sizes="(max-width: 640px) 200px, (max-width: 768px) 260px, 320px"
        />
      </div>

      {/* Elegant dark overlay */}
      <div
        className={`absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-700 rounded-[inherit] ${
          isHovered ? "opacity-95" : "opacity-80"
        }`}
      ></div>

      {/* Promo / Discount Badge */}
      {discount && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-black px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full uppercase tracking-widest shadow-md border border-white/10 select-none">
          {t("showcase.discount_badge", { discount })}
        </div>
      )}

      {/* Card Content */}
      <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 md:p-7 z-20 flex flex-col justify-end transform transition-transform duration-500 ease-out">
        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-white/60 mb-1 sm:mb-1.5 block font-bold">
          {category}
        </span>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1.5 sm:mb-2.5 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-300">
          {productTitle}
        </h3>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide">
            {priceText}
          </span>
          {isSale && originalPriceText && (
            <span className="text-[10px] sm:text-xs md:text-sm text-white/40 line-through tracking-wide">
              {originalPriceText
                ? originalPriceText.startsWith("$")
                  ? originalPriceText
                  : `${originalPriceText}`
                : ""}
            </span>
          )}
        </div>

        {/* Action Button - Always visible on mobile, hover on desktop */}
        <div className="overflow-hidden transition-all duration-500 ease-in-out mt-3 sm:mt-4 rounded-xl max-h-10 opacity-100 md:max-h-0 md:opacity-0 group-hover:md:max-h-12 group-hover:md:opacity-100">
          <div className="flex items-center justify-center w-full bg-white/20 hover:bg-white/30 border border-white/20 text-white text-[9px] sm:text-[11px] tracking-widest font-bold py-2.5 sm:py-3 rounded-xl transition-all duration-300 active:scale-[0.98]">
            {t("showcase.quick_view")}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default function Style1({
  title,
  subtitle,
  description,
  type = "trending",
  products = [],
  endsAt,
  promoCode,
}: ProductShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const t = useTranslations("HomePage")
  const locale = useLocale()
  const isRTL =
    locale === "default" || locale.startsWith("fa") || locale.startsWith("ir")
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    if (!endsAt) return

    const targetDate = new Date(endsAt).getTime()
    const updateTimer = () => {
      const difference = targetDate - new Date().getTime()
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return false
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      })
      return true
    }

    updateTimer()
    const interval = setInterval(() => {
      const running = updateTimer()
      if (!running) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [endsAt])

  const showNavigation = products.length > 3

  const getIcon = () => {
    switch (type) {
      case "discount":
        return <Percent className="w-4 h-4 text-red-500" />
      case "campaign":
        return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      case "trending":
      default:
        return <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
    }
  }

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current
    if (!container) return
    const scrollAmount = direction === "left" ? -340 : 340
    container.scrollBy({ left: scrollAmount, behavior: "smooth" })
  }

  return (
    <div className="relative w-full py-10 sm:py-16 md:py-24 overflow-hidden bg-transparent">
      {/* Sleek Gradient Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] sm:w-[45%] h-[45%] bg-primary/5 blur-[100px] sm:blur-[130px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[50%] sm:w-[35%] h-[35%] bg-primary/5 blur-[90px] sm:blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-muted/30 border border-border/30 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full w-fit">
            {getIcon()}
            <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-muted-foreground select-none">
              {subtitle ||
                (type === "discount"
                  ? t("showcase.special_offers")
                  : type === "campaign"
                  ? t("showcase.exclusive_campaign")
                  : t("showcase.most_visited"))}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground tracking-tight leading-none uppercase">
            {title || t("showcase.featured_products")}
          </h2>

          {description && (
            <p className="text-muted-foreground max-w-xl text-xs sm:text-sm md:text-base font-light leading-relaxed">
              {description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-0">
            {promoCode && (
              <div className="flex items-center gap-2 sm:gap-3 bg-red-500/10 dark:bg-red-500/15 border border-red-500/30 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.08)] select-all transition-all duration-300 hover:border-red-500/50">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-black text-red-500 tracking-wide uppercase select-none">
                  {t("promo_code_label")}
                </span>
                <div className="h-3 sm:h-4 w-[1px] bg-red-500/30"></div>
                <span className="font-mono text-[10px] sm:text-xs md:text-sm font-black tracking-wider text-red-500 bg-red-500/10 px-2 sm:px-2.5 py-0.5 rounded-lg border border-red-500/10">
                  {promoCode}
                </span>
              </div>
            )}

            {endsAt && timeLeft && (
              <div
                className="flex items-center gap-2 sm:gap-3 bg-muted/40 backdrop-blur-sm border border-border/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl shadow-sm select-none"
                dir="ltr"
              >
                <div className="flex flex-col items-center min-w-[24px] sm:min-w-[32px]">
                  <span className="text-xs sm:text-sm md:text-base font-black text-foreground tabular-nums">
                    {timeLeft.days}
                  </span>
                  <span className="text-[7px] sm:text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {t("days")}
                  </span>
                </div>
                <span className="text-muted-foreground/30 text-xs sm:text-sm font-black -translate-y-1 select-none">
                  :
                </span>
                <div className="flex flex-col items-center min-w-[24px] sm:min-w-[32px]">
                  <span className="text-xs sm:text-sm md:text-base font-black text-foreground tabular-nums">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[7px] sm:text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {t("hours")}
                  </span>
                </div>
                <span className="text-muted-foreground/30 text-xs sm:text-sm font-black -translate-y-1 select-none">
                  :
                </span>
                <div className="flex flex-col items-center min-w-[24px] sm:min-w-[32px]">
                  <span className="text-xs sm:text-sm md:text-base font-black text-foreground tabular-nums">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[7px] sm:text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                    {t("minutes")}
                  </span>
                </div>
                <span className="text-muted-foreground/30 text-xs sm:text-sm font-black -translate-y-1 select-none">
                  :
                </span>
                <div className="flex flex-col items-center min-w-[24px] sm:min-w-[32px]">
                  <span className="text-xs sm:text-sm md:text-base font-black text-foreground tabular-nums text-red-500">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[7px] sm:text-[9px] uppercase tracking-wider text-red-500/80 font-semibold">
                    {t("seconds")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3 sm:gap-4 self-start md:self-auto mt-2 md:mt-0">
          <LocalizedClientLink
            href="/store"
            className="group inline-flex items-center gap-1.5 sm:gap-2 bg-background/65 hover:bg-foreground/5 active:scale-95 border border-border/40 backdrop-blur-md text-foreground px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-sm hover:shadow text-[10px] sm:text-xs md:text-sm font-bold transition-all duration-300"
          >
            <span>{t("view_all")}</span>
            {isRTL ? (
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
            )}
          </LocalizedClientLink>

          {/* Sleek Prev/Next Arrows */}
          {showNavigation && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => handleScroll("left")}
                className="bg-background/65 hover:bg-foreground/5 active:scale-95 border border-border/40 backdrop-blur-md text-foreground rounded-full p-2 sm:p-2.5 shadow-sm hover:shadow transition-all duration-300"
                aria-label={t("showcase.scroll_left")}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="bg-background/65 hover:bg-foreground/5 active:scale-95 border border-border/40 backdrop-blur-md text-foreground rounded-full p-2 sm:p-2.5 shadow-sm hover:shadow transition-all duration-300"
                aria-label={t("showcase.scroll_right")}
              >
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Scroll Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {products.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 pb-6 sm:pb-8 pt-2 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {products.map((p) => (
              <ProductShowcaseCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-muted/20 border border-border/30 rounded-3xl mx-6 md:mx-12 mb-8">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl opacity-50">📦</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">
              {t("showcase.no_products_title")}
            </h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              {t("showcase.no_products_desc")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
