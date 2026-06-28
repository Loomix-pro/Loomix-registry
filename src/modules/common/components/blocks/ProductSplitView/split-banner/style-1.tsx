"use client"

import React, { useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
const hasPersian = (text?: string) =>
  text ? /[\u0600-\u06FF]/.test(text) : false

/**
 * Guide for creating a new Split Banner Block style
 * 
 * This component acts as a UI block for displaying a promotional banner, typically 
 * placed alongside or integrated with the Product Scroll view in a split layout.
 * If you intend to create a new style (e.g., style-3), you must consider the following:
 * 
 * 1. Received Data (Props - `SplitBannerStageProps`):
 *    - `banner`: An object containing the banner data:
 *      - `title`, `subtitle`, `description`: Textual information for the promotional message.
 *      - `buttonText`, `buttonLink`: Data for rendering a Call-to-Action (CTA) button.
 *      - `image`: URL or media object for the banner's background or featured image.
 * 
 * 2. Component Structure & Interactivity:
 *    - Intersection Observer: It uses an `IntersectionObserver` to add reveal animations 
 *      (`.show.active` classes) to elements as they come into the viewport. Ensure you add 
 *      the `.reveal` class to the elements you wish to animate.
 * 
 * 3. Media Rendering:
 *    - It's best practice to use `next/image` for rendering the `image` payload. Handle 
 *    both absolute and relative URL cases if your CMS outputs variations.
 * 
 * 4. Final Output (Return):
 *    Your component should return a responsive JSX wrapper. Typically this acts as a visually 
 *    striking hero element, often full-height or large format, serving as a companion to 
 *    product collections.
 */
export default function SplitBannerStage({ banner }: SplitBannerStageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { title, subtitle, description, buttonText, buttonLink, image } = banner

  useEffect(() => {
    if (!containerRef.current) return

    const gridItems = containerRef.current.querySelectorAll(".reveal")

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
  }, [])

  const imageUrl = image?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${
        image.url
      }`
    : "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2071&auto=format&fit=crop"

  const mainTitleParts = title ? title.split(" ") : ["CLOSET", "STUDIO"]
  const mainTitleFirst = mainTitleParts[0]
  const mainTitleRest = mainTitleParts.slice(1).join(" ")

  return (
    <div
      ref={containerRef}
      className="bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground w-full"
    >
      <section className="relative h-[80dvh] md:h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden bg-background">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={imageUrl}
            fill
            className="object-cover opacity-70 dark:opacity-50 animate-slow-pan"
            alt={image?.alternativeText || "Banner"}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-transparent"></div>
        </div>

        {/* Light Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-muted-foreground/10 blur-[150px] rounded-full"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 w-full flex flex-col items-center justify-center pt-20">
          {subtitle && (
            <div className="overflow-hidden mb-4 md:mb-6 w-full flex justify-center">
              <span
                className={`block text-[10px] md:text-xs font-black text-muted-foreground uppercase reveal text-center ${
                  hasPersian(subtitle)
                    ? "tracking-normal ps-0"
                    : "tracking-[0.3em] md:tracking-[0.8em] ps-[0.3em] md:ps-[0.8em]"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                {subtitle}
              </span>
            </div>
          )}

          <h2
            className={`text-4xl sm:text-6xl md:text-[6rem] lg:text-[8rem] font-black leading-[0.9] text-foreground w-full flex flex-col items-center justify-center text-center ${
              hasPersian(title) ? "tracking-normal" : "tracking-tighter"
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
            {mainTitleRest && (
              <div className="overflow-hidden mt-2 w-full flex justify-center">
                <span
                  className="block italic font-light text-foreground/90 reveal text-center"
                  style={{ animationDelay: "0.6s" }}
                >
                  {mainTitleRest}
                </span>
              </div>
            )}
          </h2>

          {description && (
            <div className="mt-6 md:mt-12 overflow-hidden w-full flex justify-center">
              <p
                className="text-foreground/80 text-center text-sm md:text-lg max-w-2xl font-light leading-relaxed tracking-wide reveal drop-shadow-md"
                style={{ animationDelay: "0.8s" }}
              >
                {description}
              </p>
            </div>
          )}

          {buttonText && (
            <div
              className="mt-12 overflow-hidden w-full flex justify-center reveal"
              style={{ animationDelay: "1.0s" }}
            >
              <div className="glow-container rounded-full inline-block">
                <LocalizedClientLink
                  href={buttonLink || "#"}
                  className="btn-shine relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-primary/90 backdrop-blur-md px-10 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] border border-primary-foreground/10"
                >
                  <span
                    className={`relative z-10 uppercase ${
                      hasPersian(buttonText)
                        ? "tracking-normal"
                        : "tracking-widest"
                    }`}
                  >
                    {buttonText}
                  </span>
                  <ArrowDown
                    className="relative z-10 -rotate-90 transition-transform group-hover:translate-x-1"
                    width={18}
                  />
                </LocalizedClientLink>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
