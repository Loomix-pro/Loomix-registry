"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/shadcn/button"

const bentoGridVariants = cva(
  "relative grid gap-4 [&>*:first-child]:origin-top-right [&>*:nth-child(3)]:origin-bottom-right [&>*:nth-child(4)]:origin-top-right",
  {
    variants: {
      variant: {
        default: `
          grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr]
          [&>*:first-child]:col-start-1 [&>*:first-child]:col-end-9 [&>*:first-child]:row-start-1 [&>*:first-child]:row-end-4 md:[&>*:first-child]:col-end-7 md:[&>*:first-child]:row-end-3
          [&>*:nth-child(2)]:hidden md:[&>*:nth-child(2)]:block md:[&>*:nth-child(2)]:col-start-7 md:[&>*:nth-child(2)]:col-end-9 md:[&>*:nth-child(2)]:row-start-1 md:[&>*:nth-child(2)]:row-end-3
          [&>*:nth-child(3)]:hidden md:[&>*:nth-child(3)]:block md:[&>*:nth-child(3)]:col-start-7 md:[&>*:nth-child(3)]:col-end-9 md:[&>*:nth-child(3)]:row-start-3 md:[&>*:nth-child(3)]:row-end-5
          [&>*:nth-child(4)]:col-start-1 [&>*:nth-child(4)]:col-end-5 [&>*:nth-child(4)]:row-start-4 [&>*:nth-child(4)]:row-end-5 md:[&>*:nth-child(4)]:col-end-4 md:[&>*:nth-child(4)]:row-start-3
          [&>*:nth-child(5)]:col-start-5 [&>*:nth-child(5)]:col-end-9 [&>*:nth-child(5)]:row-start-4 [&>*:nth-child(5)]:row-end-5 md:[&>*:nth-child(5)]:col-start-4 md:[&>*:nth-child(5)]:col-end-7 md:[&>*:nth-child(5)]:row-start-3
        `,
        threeCells: `
          grid-cols-2 grid-rows-2
          [&>*:first-child]:col-span-2
      `,
        fourCells: `
        grid-cols-3 grid-rows-2
        [&>*:first-child]:col-span-1
        [&>*:nth-child(2)]:col-span-2
        [&>*:nth-child(3)]:col-span-2
      `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}
const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)
function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component"
    )
  }
  return context
}
const ContainerScroll = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  })
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-[250vh] w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

const BentoGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof bentoGridVariants>
>(({ variant, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(bentoGridVariants({ variant }), className)}
      {...props}
    />
  )
})
BentoGrid.displayName = "BentoGrid"

const BentoCell = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext()
    const translate = useTransform(scrollYProgress, [0, 0.7], ["-35%", "0%"])
    const scale = useTransform(scrollYProgress, [0, 0.7], [0.5, 1])

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ translate, scale, ...style }}
        {...props}
      ></motion.div>
    )
  }
)
BentoCell.displayName = "BentoCell"

const ContainerScale = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext()
    const opacity = useTransform(
      scrollYProgress,
      [0, 0.2, 0.6, 1],
      [1, 1, 0, 0]
    )
    const scale = useTransform(
      scrollYProgress,
      [0, 0.2, 0.6, 1],
      [1, 1, 0.8, 0.8]
    )

    return (
      <motion.div
        ref={ref}
        className={cn(
          "absolute left-1/2 top-1/2 size-fit z-20 pointer-events-auto",
          className
        )}
        style={{
          translate: "-50% -50%",
          scale,
          opacity,
          ...style,
        }}
        {...props}
      />
    )
  }
)
ContainerScale.displayName = "ContainerScale"

export { ContainerScroll, BentoGrid, BentoCell, ContainerScale }

export default function SplitBannerStageStyle2({ banner }: { banner: any }) {
  const { title, description, buttonText, buttonLink } = banner || {}

  const imagesToUse = React.useMemo(() => {
    const allImages: string[] = []
    const STRAPI_URL =
      process.env.STRAPI_URL ||
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      "http://localhost:1337"

    const addImages = (imgArray: any[]) => {
      if (imgArray && Array.isArray(imgArray)) {
        imgArray.forEach((img: any) => {
          if (img?.url) {
            allImages.push(
              img.url.startsWith("http") ? img.url : `${STRAPI_URL}${img.url}`
            )
          }
        })
      }
    }

    addImages(banner?.mainImages || [])
    addImages(banner?.sideImages || [])

    if (allImages.length === 0) {
      return [
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80",
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
        "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80",
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
      ]
    }
    return allImages
  }, [banner?.mainImages, banner?.sideImages])

  return (
    <ContainerScroll className="relative min-h-[180vh] w-full">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-4 md:px-8">
        {/* Center Content (Text & Buttons) */}
        <ContainerScale className="z-20 text-center flex flex-col items-center justify-center max-w-2xl px-4 pointer-events-auto">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            {title || "Your Animated Hero"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            {description ||
              "Yet another hero section, this time with scroll trigger animations, animating the hero content with motion."}
          </p>
          <div className="flex items-center justify-center gap-4">
            {buttonText && buttonLink ? (
              <LocalizedClientLink href={buttonLink}>
                <Button
                  size="lg"
                  className="rounded-lg font-medium px-6 py-2.5"
                >
                  {buttonText}
                </Button>
              </LocalizedClientLink>
            ) : (
              <Button size="lg" className="rounded-lg font-medium px-6 py-2.5">
                Get Started
              </Button>
            )}
          </div>
        </ContainerScale>

        {/* Demo 1: BentoGrid Layout with 5 Cells */}
        <BentoGrid
          variant="default"
          dir="Rtl"
          className="w-full max-w-6xl h-[550px] md:h-[650px] pointer-events-none [direction:rtl]"
        >
          {/* Cell 1: Top Left */}
          <BentoCell className="overflow-hidden rounded-2xl shadow-2xl bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagesToUse[0 % imagesToUse.length]}
              alt="Hero Demo 1"
              className="w-full h-full object-cover rounded-2xl"
            />
          </BentoCell>

          {/* Cell 2: Top Right */}
          <BentoCell className="overflow-hidden rounded-2xl shadow-2xl bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagesToUse[1 % imagesToUse.length]}
              alt="Hero Demo 2"
              className="w-full h-full object-cover rounded-2xl"
            />
          </BentoCell>

          {/* Cell 3: Middle Right */}
          <BentoCell className="overflow-hidden rounded-2xl shadow-2xl bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagesToUse[2 % imagesToUse.length]}
              alt="Hero Demo 3"
              className="w-full h-full object-cover rounded-2xl"
            />
          </BentoCell>

          {/* Cell 4: Bottom Left */}
          <BentoCell className="overflow-hidden rounded-2xl shadow-2xl bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagesToUse[3 % imagesToUse.length]}
              alt="Hero Demo 4"
              className="w-full h-full object-cover rounded-2xl"
            />
          </BentoCell>

          {/* Cell 5: Bottom Right */}
          <BentoCell className="overflow-hidden rounded-2xl shadow-2xl bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagesToUse[4 % imagesToUse.length]}
              alt="Hero Demo 5"
              className="w-full h-full object-cover rounded-2xl"
            />
          </BentoCell>
        </BentoGrid>
      </div>
    </ContainerScroll>
  )
}
