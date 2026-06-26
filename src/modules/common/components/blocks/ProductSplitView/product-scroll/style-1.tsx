/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import React, { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import ProductHero from "../../hero/product-hero"
import { getPricesForVariant } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "next-intl"
import Image from "next/image"

const hasPersian = (text?: string) =>
  text ? /[\u0600-\u06FF]/.test(text) : false

import ProductCard from "@modules/products/components/product-cards"

export default function Style1({
  products = [],
  region,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink = "#",
  style,
}: ScrollStageProps) {
  const tHome = useTranslations("HomePage")
  const finalTitle = title || "CLOSET STUDIO"
  const finalSubtitle = subtitle || "EST. 2024 — COLLECTION"
  const finalDescription = description || tHome("style1_desc")
  const finalButtonText = buttonText || tHome("view_collection")
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleContainerScroll = () => {
      const indicator = scrollIndicatorRef.current
      const track = indicator?.parentElement
      if (!indicator || !track) return

      const maxScroll = container.scrollWidth - container.clientWidth
      if (maxScroll <= 0) {
        track.style.display = "none"
        return
      } else {
        track.style.display = "block"
      }

      const scrollPercentage =
        (Math.abs(container.scrollLeft) / maxScroll) * 100
      indicator.style.left = `${scrollPercentage * 0.666}%`
    }

    container.addEventListener("scroll", handleContainerScroll, {
      passive: true,
    })
    const timeoutId = setTimeout(handleContainerScroll, 100)

    window.addEventListener("resize", handleContainerScroll)

    return () => {
      container.removeEventListener("scroll", handleContainerScroll)
      window.removeEventListener("resize", handleContainerScroll)
      clearTimeout(timeoutId)
    }
  }, [products])

  useEffect(() => {
    if (!containerRef.current) return

    const gridItems = containerRef.current.querySelectorAll(
      ".grid-item, .reveal"
    )

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px",
    }

    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show", "active")
        }
      })
    }, observerOptions)

    gridItems.forEach((item) => {
      gridObserver.observe(item)
    })

    return () => {
      gridObserver.disconnect()
    }
  }, [products])

  if (!products || products.length === 0) return null

  const mainTitleParts = finalTitle.split(" ")
  const mainTitleFirst = mainTitleParts[0]
  const mainTitleRest = mainTitleParts.slice(1).join(" ")

  return (
    <div
      ref={containerRef}
      className="bg-transparent text-foreground antialiased selection:bg-primary selection:text-primary-foreground w-full"
    >
      {/* Intro Section - Cinematic Version */}
      <section className="relative h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-transparent">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2071&auto=format&fit=crop"
            fill
            className="object-cover opacity-60 dark:opacity-40 grayscale animate-slow-pan"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background"></div>
        </div>

        {/* Light Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-muted-foreground/10 blur-[150px] rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 -mt-16 md:-mt-32 w-full flex flex-col items-center justify-center">
          <div className="overflow-hidden mb-4 md:mb-6 w-full flex justify-center">
            <span
              className={`block text-[9px] md:text-[10px] font-black text-muted-foreground uppercase reveal text-center ${
                hasPersian(finalSubtitle)
                  ? "tracking-normal ps-0"
                  : "tracking-[0.3em] md:tracking-[0.8em] ps-[0.3em] md:ps-[0.8em]"
              }`}
              style={{ animationDelay: "0.2s" }}
            >
              {finalSubtitle}
            </span>
          </div>

          <h1
            className={`text-4xl sm:text-6xl md:text-[8rem] lg:text-[10rem] font-black leading-[0.85] text-foreground w-full flex flex-col items-center justify-center text-center ${
              hasPersian(finalTitle) ? "tracking-normal" : "tracking-tighter"
            }`}
          >
            <div className="overflow-hidden w-full flex justify-center">
              <span
                className="block reveal text-center"
                style={{ animationDelay: "0.4s" }}
              >
                {mainTitleFirst}
              </span>
            </div>
            <div className="overflow-hidden mt-2 w-full flex justify-center">
              <span
                className="block italic font-light text-muted-foreground reveal text-center"
                style={{ animationDelay: "0.6s" }}
              >
                {mainTitleRest}
              </span>
            </div>
          </h1>

          <div className="mt-6 md:mt-12 overflow-hidden w-full flex justify-center">
            <p
              className="text-muted-foreground text-center text-sm md:text-base max-w-lg font-light leading-relaxed tracking-wide reveal"
              style={{ animationDelay: "0.8s" }}
            >
              {finalDescription}
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 md:bottom-12 flex flex-col items-center gap-4 reveal"
          style={{ animationDelay: "1.2s" }}
        >
          <div className="w-[1px] h-12 md:h-20 bg-foreground/10 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent via-foreground/50 to-transparent animate-scroll-light"></div>
          </div>
          <span className="text-[9px] font-bold text-foreground/40 tracking-normal">
            {tHome("scroll_down")}
          </span>
        </div>
      </section>

      {/* Products - Render ProductHero for each item */}
      {products.map((product, index) => (
        <ProductHero key={product.id} product={product} reversed={index % 2 !== 0} />
      ))}

      {/* Summary Horizontal Collection - Using the same items */}
      <div
        id="final-collection"
        className="bg-transparent w-full py-24 md:py-32 border-t border-border"
      >
        <div className="w-full max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase block mb-3">
              {tHome("overview")}
            </span>
          </div>
          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-8 pb-8 no-scrollbar snap-x snap-mandatory justify-start md:justify-center"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="grid-item group cursor-pointer w-[calc(50%-8px)] min-w-[calc(50%-8px)] max-w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] sm:min-w-[calc(33.333%-11px)] sm:max-w-[calc(33.333%-11px)] md:w-[300px] md:min-w-[300px] md:max-w-[320px] snap-center flex-shrink-0"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <ProductCard product={product} region={region} cardType={(style as any)?.card_style || "card-2"} />
              </div>
            ))}
          </div>

          {/* Horizontal Scroll Progress Bar */}
          <div className="w-24 h-[2px] bg-foreground/10 mx-auto mt-2 mb-12 rounded-full overflow-hidden relative">
            <div
              ref={scrollIndicatorRef}
              className="h-full bg-foreground w-8 rounded-full absolute left-0 transition-all duration-75"
              style={{ left: "0%" }}
            />
          </div>

          {/* Eye-Catching CTA Button */}
          <div
            className="flex justify-center mt-12 grid-item"
            style={{ transitionDelay: "500ms" }}
          >
            <div className="glow-container rounded-full inline-block">
              <LocalizedClientLink
                href={buttonLink || "#"}
                className="btn-shine relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary px-10 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)]"
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
        </div>
      </div>
    </div>
  )
}
