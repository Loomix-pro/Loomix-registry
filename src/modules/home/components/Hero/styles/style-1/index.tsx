"use client"

import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"
import type { SplitBannerSection } from "@lib/data/homepage"

interface HeroStyle1Props {
  section: SplitBannerSection
}

/**
 * Hero Block — Style 1
 *
 * A clean, full-width hero section with:
 * - A primary image (mainImages[0]) as the background/featured image
 * - Optional badge, title, description, and CTA button
 *
 * To create a new Hero style (e.g. style-2):
 *  1. Duplicate this file into `styles/style-2/index.tsx`
 *  2. Register it in `../../registry.ts`
 *  3. Add the style string in Strapi's hp-section-hero content type
 *
 * Props come from `SplitBannerSection` (defined in @lib/data/homepage):
 *  - section.mainImages  – array of media objects (url, width, height, alt)
 *  - section.sideImages  – secondary/accent images
 *  - section.title, section.badge, section.description
 *  - section.buttonText, section.buttonLink
 */
export default function HeroStyle1({ section }: HeroStyle1Props) {
  const mainImage = section.mainImages?.[0]

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 min-h-[480px] sm:min-h-[600px]">
      {/* Background image */}
      {mainImage && (
        <Image
          src={mainImage.url}
          alt={mainImage.alternativeText || section.title || "Hero"}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[480px] sm:min-h-[600px] px-6 pb-12 sm:px-12 sm:pb-16 max-w-4xl mx-auto">
        {section.badge && (
          <span className="inline-block mb-4 px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-white/10 text-white/80 backdrop-blur-sm border border-white/20 w-fit">
            {section.badge}
          </span>
        )}

        {section.title && (
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            {section.title}
          </h2>
        )}

        {section.description && (
          <p className="text-base sm:text-lg text-white/70 max-w-xl mb-8 leading-relaxed">
            {section.description}
          </p>
        )}

        {section.buttonText && section.buttonLink && (
          <LocalizedClientLink href={section.buttonLink}>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm",
                "bg-white text-neutral-900 hover:bg-neutral-100",
                "transition-all duration-200 shadow-lg hover:shadow-white/20",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              )}
            >
              {section.buttonText}
            </button>
          </LocalizedClientLink>
        )}
      </div>
    </section>
  )
}
