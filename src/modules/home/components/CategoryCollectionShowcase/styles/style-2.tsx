"use client"

import React, { useState } from "react"
import { HpSectionCategoryCollection } from "@lib/data/homepage"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { getMediaUrl } from "@lib/util/strapi-media"
import BlockHeader from "@modules/common/components/block-header"
import { ArrowLeft } from "lucide-react"
import { Button } from "@modules/common/components/shadcn/button"
import { useTranslations } from "next-intl"

interface Style2Props {
  section: HpSectionCategoryCollection
}

export default function CategoryCollectionStyle2({ section }: Style2Props) {
  const t = useTranslations("HomePage")
  const { title, description, badge, textLink, linkUrl, items, headerStyle } = section
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)

  if (!items || items.length === 0) return null

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Header ─────────────────────────────────────── */}
      <BlockHeader
        title={title}
        badge={badge}
        description={description}
        linkText={textLink}
        linkHref={linkUrl}
        style={headerStyle}
      />

      {/* ── Interactive Accordion Showcase ────────────── */}
      <div className="mt-8 flex flex-col md:flex-row w-full gap-4 h-auto md:h-[550px] min-h-[400px]">
        {items.map((item, index) => {
          const isCategory = item.__component === "category-collection.category-item"

          const fallbackTitle = isCategory ? item.category?.name : item.collection?.title
          const fallbackDescription = isCategory ? item.category?.description : ""
          const fallbackHandle = isCategory ? item.category?.medusaHandle : item.collection?.medusaHandle
          const fallbackLink = isCategory && fallbackHandle
            ? `/categories/${fallbackHandle}`
            : fallbackHandle ? `/collections/${fallbackHandle}` : "#"

          const displayTitle = item.title || fallbackTitle || "Untitled"
          const displayDescription = item.description || fallbackDescription
          const displayLink = item.link || fallbackLink
          const imageUrl = getMediaUrl(item.image?.[0]?.url)
          
          const isHovered = hoveredIndex === index
          const indexLabel = String(index + 1).padStart(2, "0")

          return (
            <div
              key={`${item.__component}-${item.id || index}`}
              onMouseEnter={() => setHoveredIndex(index)}
              className={`
                relative overflow-hidden rounded-3xl border border-border/50 bg-muted/10
                transition-all duration-700 ease-in-out cursor-pointer
                w-full md:w-auto h-[350px] md:h-full
                ${isHovered ? "md:flex-[3] shadow-[0_20px_50px_rgba(0,0,0,0.15)]" : "md:flex-[1]"}
              `}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={item.image?.[0]?.alternativeText || displayTitle}
                    fill
                    className={`
                      object-cover transition-all duration-1000 ease-out
                      ${isHovered ? "scale-105 grayscale-0 opacity-100" : "scale-100 grayscale-[40%] opacity-70 md:opacity-50"}
                    `}
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-ui-bg-component to-ui-bg-subtle" />
                )}

                {/* Dark Gradient Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20
                  transition-opacity duration-700
                  ${isHovered ? "opacity-95" : "opacity-80 md:opacity-75"}
                `} />
              </div>

              {/* Index label / Type Indicator */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-white/50 tracking-wider">
                  {indexLabel}
                </span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
                  {isCategory ? t("category") : t("collection")}
                </span>
              </div>

              {/* Card Content Wrapper */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10">
                
                {/* Horizontal view (Visible when active) */}
                <div className={`
                  transition-all duration-500 ease-out
                  ${isHovered ? "opacity-100 translate-y-0" : "md:opacity-0 md:translate-y-8"}
                `}>
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
                    {displayTitle}
                  </h3>
                  
                  {displayDescription && (
                    <p className="text-sm text-white/70 line-clamp-3 mb-5 max-w-md font-light leading-relaxed">
                      {displayDescription}
                    </p>
                  )}

                  <LocalizedClientLink href={displayLink} className="inline-block w-fit">
                    <Button className="rounded-full px-6 py-2 h-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      {t("explore")}
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </Button>
                  </LocalizedClientLink>
                </div>

                {/* Vertical title (Visible when collapsed on desktop only) */}
                <div className={`
                  hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 origin-bottom whitespace-nowrap
                  transition-all duration-500 ease-out
                  ${isHovered ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"}
                `}
                style={{ transform: "rotate(-90deg) translate(0, -50%)" }}
                >
                  <span className="text-base font-bold text-white/70 tracking-widest uppercase">
                    {displayTitle}
                  </span>
                </div>

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
