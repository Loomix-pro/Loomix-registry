"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowDown } from "lucide-react"
import ShinyText from "@modules/common/components/ShinyText"
import BlurText from "@modules/common/components/BlurText"
import { Button } from "@modules/common/components/shadcn/button"

export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip"

interface FlipCardProps {
  src: string
  index: number
  total: number
  phase: AnimationPhase
  target: { x: number; y: number; rotation: number; scale: number; opacity: number }
}

const IMG_WIDTH = 60
const IMG_HEIGHT = 85

function FlipCard({ src, index, target }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 15,
      }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-muted"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`banner-img-${index}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-foreground flex flex-col items-center justify-center p-4 border border-border"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="text-[8px] md:text-[9px] font-bold text-primary uppercase tracking-widest">Discovery</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const TOTAL_IMAGES = 20
const MAX_SCROLL = 3000

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t

export default function SplitBannerStage({ banner }: any) {
  const { title, badge, description, buttonText, buttonLink, mainImages, sideImages } = banner || {}
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter")
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Background image (ONLY if explicitly uploaded in mainImages in CMS)
  const bgImage = useMemo(() => {
    const STRAPI_URL = (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL) || "http://localhost:1337"
    if (mainImages && Array.isArray(mainImages) && mainImages.length > 0 && mainImages[0]?.url) {
      const url = mainImages[0].url
      return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
    }
    return null
  }, [mainImages])

  // Card images (FlipCards): sideImages first, then mainImages, then unsplash fallback
  const imagesToUse = useMemo(() => {
    const allImages: string[] = []
    const STRAPI_URL = (process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL) || "http://localhost:1337"

    const addImages = (imgArray: any[]) => {
      if (imgArray && Array.isArray(imgArray)) {
        imgArray.forEach((img: any) => {
          if (img?.url) {
            allImages.push(img.url.startsWith("http") ? img.url : `${STRAPI_URL}${img.url}`)
          }
        })
      }
    }

    addImages(sideImages || [])
    if (allImages.length === 0) {
      addImages(mainImages || [])
    }

    // If still empty, use fallback array
    if (allImages.length === 0) {
      return [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80",
        "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&q=80",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80",
        "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=300&q=80",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80",
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&q=80",
      ]
    }
    return allImages
  }, [mainImages, sideImages])

  // Create an array of TOTAL_IMAGES by repeating imagesToUse
  const displayImages = useMemo(() => {
    const arr = []
    for (let i = 0; i < TOTAL_IMAGES; i++) {
      arr.push(imagesToUse[i % imagesToUse.length])
    }
    return arr
  }, [imagesToUse])

  // --- Container Size ---
  useEffect(() => {
    if (!containerRef.current) return

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        })
      }
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(containerRef.current)

    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    })

    return () => observer.disconnect()
  }, [])

  // --- Virtual Scroll Logic ---
  const virtualScroll = useMotionValue(0)
  const scrollRef = useRef(0)
  const lastWindowScrollRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      const isAtTop = window.scrollY === 0

      if (e.deltaY > 0) {
        // Scrolling down
        if (scrollRef.current < MAX_SCROLL) {
          e.preventDefault()
          const newScroll = Math.min(scrollRef.current + e.deltaY, MAX_SCROLL)
          scrollRef.current = newScroll
          virtualScroll.set(newScroll)
        }
      } else if (e.deltaY < 0) {
        // Scrolling up
        if (isAtTop && scrollRef.current > 0) {
          e.preventDefault()
          const newScroll = Math.max(scrollRef.current + e.deltaY, 0)
          scrollRef.current = newScroll
          virtualScroll.set(newScroll)
        }
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY - touchY
      touchStartY = touchY

      const isAtTop = window.scrollY === 0

      if (deltaY > 0) {
        // Swiping up (scrolling down)
        if (scrollRef.current < MAX_SCROLL) {
          e.preventDefault()
          const newScroll = Math.min(scrollRef.current + deltaY, MAX_SCROLL)
          scrollRef.current = newScroll
          virtualScroll.set(newScroll)
        }
      } else if (deltaY < 0) {
        // Swiping down (scrolling up)
        if (isAtTop && scrollRef.current > 0) {
          e.preventDefault()
          const newScroll = Math.max(scrollRef.current + deltaY, 0)
          scrollRef.current = newScroll
          virtualScroll.set(newScroll)
        }
      }
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY === lastWindowScrollRef.current) return

      if (scrollY > 0) {
        // If window is scrolled down, make sure virtual scroll is completed so the images are in the bottom strip
        if (scrollRef.current < MAX_SCROLL) {
          scrollRef.current = MAX_SCROLL
          virtualScroll.set(MAX_SCROLL)
        }
      } else if (scrollY === 0 && lastWindowScrollRef.current > 0) {
        // If window scrolled back to exactly 0, reset virtual scroll to 0 to show the circle/scatter intro
        scrollRef.current = 0
        virtualScroll.set(0)
      }

      lastWindowScrollRef.current = scrollY
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Initialize lastWindowScrollRef
    lastWindowScrollRef.current = window.scrollY

    return () => {
      container.removeEventListener("wheel", handleWheel)
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [virtualScroll])

  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1])
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 })

  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360])
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 })

  const mouseX = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const relativeX = e.clientX - rect.left
      const normalizedX = (relativeX / rect.width) * 2 - 1
      mouseX.set(normalizedX * 100)
    }
    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX])

  useEffect(() => {
    const timer1 = setTimeout(() => setIntroPhase("line"), 500)
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2500)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const scatterPositions = useMemo(() => {
    return displayImages.map(() => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }))
  }, [displayImages])

  const [morphValue, setMorphValue] = useState(0)
  const [rotateValue, setRotateValue] = useState(0)
  const [parallaxValue, setParallaxValue] = useState(0)

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on("change", setMorphValue)
    const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue)
    const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue)
    return () => {
      unsubscribeMorph()
      unsubscribeRotate()
      unsubscribeParallax()
    }
  }, [smoothMorph, smoothScrollRotate, smoothMouseX])

  const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1])
  const contentY = useTransform(smoothMorph, [0.8, 1], [40, 0])
  const contentScale = useTransform(smoothMorph, [0.8, 1], [0.8, 1])
  const introOpacity = useTransform(smoothMorph, [0, 0.5], [1, 0])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[80dvh] md:h-[100dvh] overflow-hidden selection:bg-primary selection:text-primary-foreground"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {bgImage && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-[3px] z-0 pointer-events-none" />
      )}
      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000 z-10 relative">

        {/* Text Layer (Centered) */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-6">
          
          {/* Intro Content: Title and Scroll Indicator (Fades out) */}
          {morphValue < 0.5 && introPhase === "circle" && (
            <motion.div
              style={{ opacity: introOpacity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center"
              >
                <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black leading-[0.9] text-foreground mb-4 drop-shadow-lg">
                  <ShinyText text={title || "CLOSET STUDIO"} speed={3} className="inline-block" />
                </h2>
                <div className="absolute top-[110%] flex flex-col items-center opacity-70">
                   <ArrowDown className="mt-3 animate-bounce text-muted-foreground" size={20} />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Active Content: Appears after morph, Centered but shifted up */}
          <div className="flex flex-col items-center justify-center text-center pointer-events-auto w-full max-w-4xl -mt-32 md:-mt-56">
            {morphValue > 0.75 && badge && (
              <div className="text-sm md:text-base font-black text-foreground uppercase tracking-[0.3em] md:tracking-[0.6em] mb-4 md:mb-6 drop-shadow-sm">
                <BlurText text={badge} delay={50} direction="top" className="justify-center" />
              </div>
            )}
            
            {morphValue > 0.75 && description && (
              <div className="text-foreground/80 text-base md:text-xl lg:text-3xl font-light leading-relaxed tracking-wide drop-shadow-md mb-8 md:mb-12">
                <BlurText text={description} delay={20} direction="bottom" className="justify-center" />
              </div>
            )}

            <motion.div style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}>
              {buttonText && (
              <LocalizedClientLink href={buttonLink || "#"}>
                <Button className="rounded-full px-8 py-5 text-xs md:text-sm uppercase tracking-widest font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/20">
                  {buttonText}
                  <ArrowDown
                    className="-rotate-90 ml-2"
                    width={16}
                  />
                </Button>
              </LocalizedClientLink>
            )}
            </motion.div>
          </div>
        </div>

        {/* Images Container */}
        <div className="relative flex items-center justify-center w-full h-full">
          {displayImages.map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 }

            if (introPhase === "scatter") {
              target = scatterPositions[i]
            } else if (introPhase === "line") {
              const lineSpacing = 70
              const lineTotalWidth = TOTAL_IMAGES * lineSpacing
              const lineX = i * lineSpacing - lineTotalWidth / 2
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 }
            } else {
              const isMobile = containerSize.width < 768
              const minDimension = Math.min(containerSize.width, containerSize.height)

              const circleRadius = Math.min(minDimension * 0.35, 350)
              const circleAngle = (i / TOTAL_IMAGES) * 360
              const circleRad = (circleAngle * Math.PI) / 180
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              }

              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5)
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1)
              const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25)
              const arcCenterY = arcApexY + arcRadius

              const spreadAngle = isMobile ? 100 : 130
              const startAngle = -90 - spreadAngle / 2
              const step = spreadAngle / (TOTAL_IMAGES - 1)

              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1)
              const maxRotation = spreadAngle * 0.8
              const boundedRotation = -scrollProgress * maxRotation

              const currentArcAngle = startAngle + i * step + boundedRotation
              const arcRad = (currentArcAngle * Math.PI) / 180

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 1.4 : 1.8,
              }

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              }
            }

            return (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                phase={introPhase}
                target={target}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
