"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from "framer-motion"
import { cn } from "lib/utils"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowDown } from "lucide-react"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { useTranslations } from "next-intl"
import { Button } from "@modules/common/components/shadcn/button"

// Mock product data for fallback
const MOCK_PRODUCTS = [
  {
    id: "prod_1",
    handle: "classic-leather-jacket",
    title: "Classic Leather Jacket",
    price: "$299.00",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "prod_2",
    handle: "minimalist-watch",
    title: "Minimalist Watch",
    price: "$149.00",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "prod_3",
    handle: "canvas-backpack",
    title: "Canvas Backpack",
    price: "$89.00",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
  },
]

export default function Style3({
  products = [],
  region,
  title = "Exclusive Collection",
  subtitle = "New Arrivals",
  description = "Discover our latest premium selection crafted for elegance and everyday wear.",
  buttonText = "Shop Now",
  buttonLink = "/store",
  image,
}: ScrollStageProps) {
  const tProduct = useTranslations("Product")
  const [displayPrices, setDisplayPrices] = useState<Record<string, string>>({})

  useEffect(() => {
    if (products.length >= 3) {
      const prices: Record<string, string> = {}
      products.slice(0, 3).forEach(p => {
        const info = getPricesForVariant(p.variants?.[0])
        prices[p.id] = info?.calculated_price || ""
      })
      setDisplayPrices(prices)
    }
  }, [products])

  // Use mock products if there are fewer than 3 products provided
  const displayProducts = products.length >= 3
    ? products.slice(0, 3).map(p => ({
      id: p.id,
      handle: p.handle,
      title: p.title,
      price: displayPrices[p.id] || "",
      image: p.thumbnail || MOCK_PRODUCTS[0].image
    }))
    : MOCK_PRODUCTS

  const STRAPI_URL = (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL) || "http://localhost:1337"
  const getImageUrl = (url: string) => url.startsWith("http") ? url : `${STRAPI_URL}${url}`
  const backgroundImageUrl = image?.url
    ? getImageUrl(image.url)
    : "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2071&auto=format&fit=crop"

  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Stage 1 to 2: Separation (0 to 0.4), then Stage 2 to 3: Overlap closer (0.4 to 0.8)
  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -48, -24])
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 48, 24])
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9])

  // Stage 2 to 3: Flip (0.4 to 0.8)
  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180])
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 6])
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -6])

  // Dynamic borders
  const borderRadiusLeft = useTransform(scrollYProgress, [0, 0.2], ["16px 0px 0px 16px", "16px 16px 16px 16px"])
  const borderRadiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "16px 16px 16px 16px"])
  const borderRadiusRight = useTransform(scrollYProgress, [0, 0.2], ["0px 16px 16px 0px", "16px 16px 16px 16px"])

  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.2])
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.4])
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`

  // Cards move up in the last viewport
  const cardsY = useTransform(scrollYProgress, [0.8, 1], [0, -150])

  // Text appearance at the end
  const textOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1])
  const textY = useTransform(scrollYProgress, [0.8, 1], [40, 0])

  // Indicator text appearance at the start
  const startTextOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const startTextY = useTransform(scrollYProgress, [0, 0.1], [0, 20])

  const [hasScrolled, setHasScrolled] = useState(false)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.1) {
      setHasScrolled(true)
    } else if (latest <= 0.1) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        // Only reveal the text if we are near the top of the container
        if (rect.top > -200) {
          setHasScrolled(false)
        }
      }
    }
  })

  return (
    <div
      ref={containerRef}
      className="relative h-[400vh] w-full bg-background overflow-clip"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden [perspective:1200px]">

        {/* Starting Text indicator */}
        {!hasScrolled && (
          <motion.div
            className="absolute top-[10%] left-0 right-0 text-center"
            style={{
              opacity: startTextOpacity,
              y: startTextY,
            }}
          >
            <p className="text-sm font-medium tracking-widest text-foreground/50 uppercase">
              {tProduct("scrollDown")}
            </p>
          </motion.div>
        )}

        {/* 3D Cards container */}
        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="flex h-[400px] sm:h-[500px] w-full max-w-4xl px-4 relative z-10"
          dir="ltr"
        >
          {displayProducts.map((product, i) => (
            <motion.div
              key={i}
              className="relative h-full flex-1"
              style={{
                x: i === 0 ? leftX : i === 2 ? rightX : 0,
                rotateY,
                rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                zIndex: i,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front Side: Hero Image Split */}
              <motion.div
                className="absolute inset-0 overflow-hidden [backface-visibility:hidden] bg-muted"
                style={{
                  zIndex: 2,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <div
                  className="absolute inset-0 h-full w-[300%]"
                  style={{
                    left: `${-100 * i}%`,
                    backgroundImage: `url(${backgroundImageUrl})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              </motion.div>

              {/* Back Side: Product Card */}
              <motion.div
                className={cn(
                  "absolute inset-0 overflow-hidden flex flex-col justify-end [backface-visibility:hidden] will-change-transform group",
                  "bg-card border border-border"
                )}
                style={{
                  transform: "rotateY(180deg)",
                  zIndex: 1,
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                }}
              >
                <LocalizedClientLink href={`/products/${product.handle || product.id}`} className="absolute inset-0 z-20">
                  <span className="sr-only">View {product.title}</span>
                </LocalizedClientLink>

                {/* Product Image */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                </div>

                {/* Product Info */}
                <div className="relative z-10 p-4 md:p-6 pb-6">
                  <h3 className="text-white text-lg md:text-xl font-bold leading-tight mb-1">
                    {product.title}
                  </h3>
                  <p className="text-white/80 font-medium tracking-wider text-sm">
                    {product.price}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ending Text and CTA */}
        <motion.div
          className="absolute bottom-[15%] left-0 right-0 text-center px-4 flex flex-col items-center justify-center z-20"
          style={{ opacity: textOpacity, y: textY }}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase block mb-3">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 max-w-2xl text-foreground">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mb-8 font-light">
            {description}
          </p>

          {buttonLink && buttonLink !== "#" && (
            <LocalizedClientLink
              href={buttonLink}
              className="inline-block mt-4"
            >
              <Button
                className="group rounded-full px-8 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2"
              >
                <span>{buttonText}</span>
                <ArrowDown className="rotate-[-90deg] transition-transform duration-300 group-hover:translate-x-1.5" width={16} />
              </Button>
            </LocalizedClientLink>
          )}
        </motion.div>
      </div>
    </div>
  )
}
