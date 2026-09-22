"use client"

import React, { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { Sparkles, ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react"
import { cn } from "@lib/utils"
import { isRtlLocale } from "@lib/util/is-rtl"
import { HttpTypes } from "@medusajs/types"
import type { HeroSection, HeroHighlight } from "@lib/data/homepage"

export interface HeroStyle3Props {
  section?: HeroSection | null
  heroProducts?: HttpTypes.StoreProduct[]
  region?: HttpTypes.StoreRegion
}

interface PillarItem {
  id: string
  num: string
  title: string
  subtitle: string
  description: string
  image: string
  link: string
}

/**
 * Hero Style 3: Interactive Expanding Visual Pillars (Accordion)
 * - 100% Viewport Height (Zero vertical scroll needed)
 * - Interactive Mouse Hover Expansion (NO automated slider)
 * - No product cards (Brand identity, editorial media, craft & trust)
 */
export default function HeroStyle3({ section }: HeroStyle3Props) {
  const router = useRouter()
  const locale = useLocale()
  const isRTL = isRtlLocale(locale)

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  // 4 Curated Pillars (using Strapi images if available, else high-end editorial fallbacks)
  const strapiImages = [
    ...(section?.mainImages || []),
    ...(section?.sideImages || []),
  ]

  const fallbackImages = [
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop",
  ]

  const buttonLink = section?.buttonLink || "/store"

  const pillars: PillarItem[] = [
    {
      id: "pillar-1",
      num: "01",
      title: "The Runway",
      subtitle: "Autumn / Winter 2026",
      description: "Sculptural forms and bold contemporary tailoring.",
      image: strapiImages[0]?.url || fallbackImages[0],
      link: buttonLink,
    },
    {
      id: "pillar-2",
      num: "02",
      title: "The Atelier",
      subtitle: "Hand-Loomed Textiles",
      description: "Artisanal Mulberry silk and virgin wool drapery.",
      image: strapiImages[1]?.url || fallbackImages[1],
      link: buttonLink,
    },
    {
      id: "pillar-3",
      num: "03",
      title: "The Silhouette",
      subtitle: "Architectural Precision",
      description: "Pure lines designed for effortless movement and presence.",
      image: strapiImages[2]?.url || fallbackImages[2],
      link: buttonLink,
    },
    {
      id: "pillar-4",
      num: "04",
      title: "The Archive",
      subtitle: "Curated Essentials",
      description: "Numbered limited editions assembled with bespoke distinction.",
      image: strapiImages[3]?.url || fallbackImages[3],
      link: buttonLink,
    },
  ]

  // Hover state (default active is first pillar on desktop)
  const [activePillar, setActivePillar] = useState<number>(0)

  // Content fallbacks
  const badgeText = section?.badge || "HAUTE COUTURE • EDITORIAL 2026"
  const titleText =
    section?.title || "Architectural Elegance in Every Dimension"
  const buttonText = section?.buttonText || "Shop Collection"

  const highlights: HeroHighlight[] =
    section?.highlights && section.highlights.length > 0
      ? section.highlights
      : [
          {
            id: 1,
            text: "100% Authentic Guarantee",
            color: "emerald",
            icon_name: "shield-check",
          },
          {
            id: 2,
            text: "Free Express Global Shipping",
            color: "primary",
            icon_name: "truck",
          },
          {
            id: 3,
            text: "Bespoke Concierge 24/7",
            color: "purple",
            icon_name: "headset",
          },
        ]

  return (
    <section
      className="relative w-full h-[calc(100dvh-4.5rem)] min-h-[560px] max-h-[920px] p-3 sm:p-5 lg:p-6 flex flex-col justify-between overflow-hidden bg-black text-white select-none"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
      aria-label="Expanding Visual Pillars Hero"
    >
      {/* ================= TOP / COMPACT FLOATING HEADER HUD ================= */}
      <div className="w-full max-w-[1720px] mx-auto flex items-center justify-between gap-4 pb-3 sm:pb-4 z-20">
        <div className="flex items-center gap-3">
          {/* Live Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span>{badgeText}</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>

          <h2 className="hidden md:inline-block text-sm font-bold text-white/90 truncate">
            {titleText}
          </h2>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push(buttonLink)}
          className="group relative inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-black bg-white hover:bg-white/90 shadow-lg shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer shrink-0"
        >
          <span>{buttonText}</span>
          <ArrowIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
        </button>
      </div>

      {/* ================= MAIN / EXPANDING PILLARS ACCORDION ================= */}
      <div className="w-full max-w-[1720px] mx-auto flex-1 flex flex-col md:flex-row gap-2.5 sm:gap-3.5 overflow-hidden z-10 py-1">
        {pillars.map((pillar, idx) => {
          const isExpanded = activePillar === idx

          return (
            <motion.div
              key={pillar.id}
              onClick={() => setActivePillar(idx)}
              onMouseEnter={() => setActivePillar(idx)}
              className={cn(
                "relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border flex flex-col justify-between p-4 sm:p-6",
                isExpanded
                  ? "flex-[3] md:flex-[2.8] border-white/40 shadow-2xl shadow-black/80"
                  : "flex-1 md:flex-1 border-white/10 hover:border-white/25 opacity-85 hover:opacity-100"
              )}
            >
              {/* Background Image */}
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                priority={idx === 0}
                className={cn(
                  "object-cover object-center transition-transform duration-1000 -z-10",
                  isExpanded ? "scale-105" : "scale-100 filter brightness-75"
                )}
              />

              {/* Vignette Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 -z-10" />

              {/* Pillar Top Bar: Number and Mini Tag */}
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white/80">
                  {pillar.num}
                </span>

                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-white"
                  >
                    {pillar.subtitle}
                  </motion.span>
                )}
              </div>

              {/* Pillar Bottom Content */}
              <div className="text-start">
                <h3
                  className={cn(
                    "font-black tracking-tight text-white transition-all duration-300",
                    isExpanded
                      ? "text-xl sm:text-3xl lg:text-4xl mb-2"
                      : "text-base sm:text-lg text-white/90"
                  )}
                >
                  {pillar.title}
                </h3>

                {isExpanded ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1"
                  >
                    <p className="text-xs sm:text-sm text-white/80 max-w-sm font-normal line-clamp-2">
                      {pillar.description}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(pillar.link)
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-white/90 transition-transform active:scale-95 shadow-md w-fit cursor-pointer"
                    >
                      <span>{isRTL ? "مشاهده بخش" : "Explore"}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ) : (
                  <span className="hidden md:inline-block text-[11px] font-medium text-white/60">
                    {pillar.subtitle}
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ================= BOTTOM / TRUST HIGHLIGHTS DOCK ================= */}
      {highlights && highlights.length > 0 && (
        <div className="w-full max-w-[1720px] mx-auto pt-3 z-20">
          <div className="w-full py-2.5 px-4 sm:px-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-around gap-4 text-start">
            {highlights.slice(0, 3).map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center gap-2.5 text-xs font-medium text-white/85"
              >
                {getFeatureIcon({
                  iconName: item.icon_name,
                  color: item.color,
                  iconSize: 15,
                })}
                <span className="truncate">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
