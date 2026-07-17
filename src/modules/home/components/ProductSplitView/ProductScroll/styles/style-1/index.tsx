"use client"

import React, { useEffect, useRef } from "react"
import { animate, stagger } from "animejs"
import { ArrowDown } from "lucide-react"
import ProductHero from "./product-hero"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"
import Image from "next/image"

const hasRtl = (text?: string) => (text ? /[\u0600-\u06FF]/.test(text) : false)

import ProductCard from "@modules/products/components/product-cards"
import ShinyText from "@modules/common/components/ShinyText"

/**
 * Guide for creating a new Product Scroll Block style
 *
 * This component acts as a UI block for displaying a horizontal scrollable list of products.
 * It's commonly used within split views or hero sections to showcase collections.
 * If you intend to create a new style (e.g., style-3), you must consider the following:
 *
 * 1. Received Data (Props - `ScrollStageProps`):
 *    - `products`: An array of `HttpTypes.StoreProduct` to be displayed.
 *    - `region`: The current store region (`HttpTypes.StoreRegion`), required by the `ProductCard`
 *      component to format prices correctly. Ensure you check for its existence before rendering cards.
 *    - `title`, `subtitle`, `description`: Descriptive headers for the block.
 *    - `buttonText`, `buttonLink`: Data for rendering a Call-to-Action (CTA) button.
 *    - `cardStyle`: Specifies which product card style to use (e.g., "card-1", "card-2"). Pass this
 *      to the `ProductCard` component.
 *
 * 2. Component Structure & Interactivity:
 *    - Horizontal Scroll Tracking: This style implements a custom scroll progress indicator using
 *      `scrollContainerRef` and `scrollIndicatorRef`.
 *    - Intersection Observer: It uses an `IntersectionObserver` to add reveal animations (`.show.active`)
 *      to elements as they come into the viewport.
 *
 * 3. Product Cards (`ProductCard`):
 *    - Make sure to import and use the global `ProductCard` component from `@modules/products/components/product-cards`
 *      to maintain consistency across the store. Pass the `product`, `region`, and `cardStyle`.
 *
 * 4. Final Output (Return):
 *    Your component should return a responsive JSX wrapper. Often on mobile devices, this might
 *    snap-scroll, while on desktops it may display as a grid or a custom draggable scroll layout.
 */
export default function Style1({
  products = [],
  region,
  title,
  badge,
  description,
  buttonText,
  buttonLink = "#",
  cardStyle = "card-2",
  image,
}: ScrollStageProps) {
  const tHome = useTranslations("HomePage")
  const tBlocks = useTranslations("Blocks")
  const finalTitle = title || tBlocks("closet_studio")
  const finalBadge = badge || tBlocks("est_2024")
  const finalDescription = description || tHome("style1_desc")
  const finalButtonText = buttonText || tHome("view_collection")

  const STRAPI_URL =
    process.env.STRAPI_URL ||
    process.env.STRAPI_URL ||
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337"
  const getImageUrl = (url: string) =>
    url.startsWith("http") ? url : `${STRAPI_URL}${url}`
  const backgroundImageUrl = image?.url
    ? getImageUrl(image.url)
    : "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2071&auto=format&fit=crop"

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const finalCollectionRef = useRef<HTMLDivElement>(null)
  const animeTriggered = useRef(false)

  useEffect(() => {
    if (!finalCollectionRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animeTriggered.current) {
          if (!finalCollectionRef.current) return
          animeTriggered.current = true

          animate(finalCollectionRef.current.querySelectorAll(".anime-card"), {
            translateY: [-200, 0],
            opacity: [0, 1],
            delay: stagger(150),
            duration: 1000,
            easing: "easeOutElastic(1, .6)",
          })
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(finalCollectionRef.current)
    return () => observer.disconnect()
  }, [products])

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

  if (!products || products.length === 0 || !region) return null

  const mainTitleParts = finalTitle.split(" ")
  const mainTitleFirst = mainTitleParts[0]
  const mainTitleRest = mainTitleParts.slice(1).join(" ")

  return (
    <div
      ref={containerRef}
      className="bg-transparent text-foreground antialiased selection:bg-primary selection:text-primary-foreground w-full"
    >
      {/* Intro Section - Cinematic Version */}
      {(image || title || badge || description) && (
        <section className="relative h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-transparent">
          {/* Cinematic Background */}
          {image?.url && (
            <div className="absolute inset-0 z-0">
              <Image
                src={backgroundImageUrl}
                fill
                className="object-cover opacity-60 dark:opacity-40 grayscale animate-slow-pan"
                alt={image?.alternativeText || "Hero"}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background"></div>
            </div>
          )}

          {/* Light Effects */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-muted-foreground/10 blur-[150px] rounded-full"></div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 -mt-6 md:-mt-32 w-full flex flex-col items-center justify-center">
            <div className="overflow-hidden mb-4 md:mb-6 w-full flex justify-center">
              <span
                className={`block text-xs sm:text-sm md:text-base font-black text-muted-foreground uppercase reveal text-center ${
                  hasRtl(finalBadge)
                    ? "tracking-normal ps-0"
                    : "tracking-[0.3em] md:tracking-[0.8em] ps-[0.3em] md:ps-[0.8em]"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                <ShinyText text={finalBadge} disabled={false} speed={3} />
              </span>
            </div>

            <h1
              className={`text-6xl sm:text-8xl md:text-[8rem] lg:text-[10rem] font-black leading-[1.05] sm:leading-[0.9] md:leading-[0.75] text-foreground w-full flex flex-col items-center justify-center text-center ${
                hasRtl(finalTitle) ? "tracking-normal" : "tracking-tighter"
              }`}
            >
              <div className="overflow-hidden w-full flex justify-center pt-2 px-6">
                <span
                  className="block reveal text-center"
                  style={{ animationDelay: "0.4s" }}
                >
                  <ShinyText
                    text={mainTitleFirst}
                    disabled={false}
                    speed={3}
                    className="px-4"
                  />
                </span>
              </div>
              <div className="overflow-hidden mt-0 w-full flex justify-center px-6">
                <span
                  className="block italic font-light text-muted-foreground reveal text-center"
                  style={{ animationDelay: "0.6s" }}
                >
                  <ShinyText
                    text={mainTitleRest}
                    disabled={false}
                    speed={3}
                    className="px-6"
                  />
                </span>
              </div>
            </h1>

            <div className="mt-6 md:mt-12 overflow-hidden w-full flex justify-center">
              <p
                className="text-muted-foreground text-center text-lg sm:text-xl md:text-2xl max-w-lg font-light leading-relaxed tracking-wide reveal"
                style={{ animationDelay: "0.8s" }}
              >
                <ShinyText text={finalDescription} disabled={false} speed={4} />
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
            <span className="text-xs sm:text-sm font-bold text-foreground/40 tracking-normal">
              {tHome("scroll_down")}
            </span>
          </div>
        </section>
      )}

      {/* Products - Render ProductHero for each item */}
      {products.map((product, index) => (
        <ProductHero
          key={product.id}
          product={product}
          reversed={index % 2 !== 0}
        />
      ))}

      {/* Summary Horizontal Collection - Using the same items */}
      <div
        ref={finalCollectionRef}
        id="final-collection"
        className="bg-transparent w-full pt-12 pb-4 md:pt-16 md:pb-6 border-t border-border"
      >
        <div className="w-full max-w-7xl mx-auto px-2">
          <div className="flex items-end justify-between border-b border-border pb-4 mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase block">
              {tHome("overview")}
            </span>
            {buttonLink && buttonLink !== "#" && (
              <LocalizedClientLink
                href={buttonLink}
                className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase text-foreground hover:text-muted-foreground transition-colors"
              >
                <span
                  className={
                    hasRtl(finalButtonText)
                      ? "tracking-normal"
                      : "tracking-[0.2em]"
                  }
                >
                  {finalButtonText}
                </span>
                <ArrowDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    hasRtl(finalButtonText)
                      ? "rotate-90 group-hover:-translate-x-0.5"
                      : "-rotate-90 group-hover:translate-x-0.5"
                  }`}
                />
              </LocalizedClientLink>
            )}
          </div>
          {/* Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-8 pb-8 no-scrollbar snap-x snap-mandatory justify-start md:justify-center"
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="anime-card grid-item group cursor-pointer w-[calc(50%-8px)] min-w-[calc(50%-8px)] max-w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] sm:min-w-[calc(33.333%-11px)] sm:max-w-[calc(33.333%-11px)] md:w-[300px] md:min-w-[300px] md:max-w-[320px] snap-center flex-shrink-0 opacity-0"
              >
                <ProductCard
                  product={product}
                  region={region}
                  cardType={cardStyle}
                />
              </div>
            ))}
          </div>

          {/* Horizontal Scroll Progress Bar */}
          <div className="w-24 h-[2px] bg-foreground/10 mx-auto mt-2 rounded-full overflow-hidden relative">
            <div
              ref={scrollIndicatorRef}
              className="h-full bg-foreground w-8 rounded-full absolute left-0 transition-all duration-75"
              style={{ left: "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
