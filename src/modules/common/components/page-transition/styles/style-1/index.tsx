"use client"

import React, { useEffect, useRef, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransitionStyle2({ children }: PageTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const content = contentRef.current
    const container = containerRef.current
    if (!canvas || !content || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Canvas pixel dimensions from window (fills visible viewport)
    // CSS absolute inset-0 keeps it clipped to the content container
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Initially hide the content completely
    content.style.clipPath = `circle(0px at 50% 50%)`
    content.style.setProperty("-webkit-clip-path", `circle(0px at 50% 50%)`)

    const sweepDuration = 1200 // ms
    const startTime = performance.now()
    let animationFrameId: number

    const getThemeColors = () => {
      const primary = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim()
      
      const wave1Color = primary ? `hsla(${primary.replace(/%/g, "")}, 0.15)` : "rgba(120, 119, 198, 0.15)"
      const wave2Color = primary ? `hsla(${primary.replace(/%/g, "")}, 0.4)` : "rgba(120, 119, 198, 0.4)"
      return { wave1Color, wave2Color }
    }

    const getThemeBackground = () => {
      const bg = getComputedStyle(document.documentElement)
        .getPropertyValue("--background")
        .trim()
      if (bg) {
        return `hsl(${bg})`
      }
      return "#0b0b0b" // fallback to dark background
    }

    const { wave1Color, wave2Color } = getThemeColors()
    const themeBg = getThemeBackground()

    const drawWavyHole = (
      R: number,
      amplitude: number,
      frequency: number,
      phase: number,
      color: string
    ) => {
      // 1. Draw solid curtain layer on canvas
      ctx.fillStyle = color
      ctx.fillRect(0, 0, width, height)

      // 2. Cut wavy hole in the center to reveal underneath layers / page
      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = "black" // color does not matter for destination-out
      ctx.beginPath()

      const centerX = width / 2
      const centerY = height / 2
      const steps = 120 // 120 steps for a highly detailed circle path
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2
        // Calculate dynamic wavy radius, clamp to 0 to avoid negative radius glitches
        const currentRadius = Math.max(R + Math.sin(theta * frequency + phase) * amplitude, 0)
        
        const x = centerX + Math.cos(theta) * currentRadius
        const y = centerY + Math.sin(theta) * currentRadius
        
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.fill()

      // Reset to default composite operation
      ctx.globalCompositeOperation = "source-over"
    }

    const updateAndDraw = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / sweepDuration, 1)

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Calculate base radius of the expansion
      const maxRadius = Math.hypot(width / 2, height / 2)
      const R = progress * maxRadius

      // Scale amplitude based on progress (0 at start and end of transition)
      const amplitudeFactor = Math.sin(progress * Math.PI)

      // Draw 3 layers of expanding liquid waves in order (outermost/solid first, to innermost/revealed last)
      // Layer 3: Solid background curtain (outermost hole, smallest revealed area)
      const R3 = R + 45 * amplitudeFactor
      const wave3Amplitude = 25 * amplitudeFactor
      drawWavyHole(R3, wave3Amplitude, 8, elapsed * 0.003, themeBg)

      // Layer 2: Middle wave (medium hole)
      const R2 = R + 20 * amplitudeFactor
      const wave2Amplitude = 35 * amplitudeFactor
      drawWavyHole(R2, wave2Amplitude, 12, -elapsed * 0.004, wave2Color)

      // Layer 1: Leading wave (innermost hole, largest revealed area)
      const R1 = R
      const wave1Amplitude = 45 * amplitudeFactor
      drawWavyHole(R1, wave1Amplitude, 10, elapsed * 0.002, wave1Color)

      // Update the circular clip-path on the content container centered in the content area
      const cX = width / 2
      const cY = height / 2
      content.style.clipPath = `circle(${R1}px at ${cX}px ${cY}px)`
      content.style.setProperty("-webkit-clip-path", `circle(${R1}px at ${cX}px ${cY}px)`)

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateAndDraw)
      } else {
        // Cleanup transition state when animation fully completes
        content.style.clipPath = ""
        content.style.removeProperty("-webkit-clip-path")
        setIsActive(false)
      }
    }

    animationFrameId = requestAnimationFrame(updateAndDraw)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      if (content) {
        content.style.clipPath = ""
        content.style.removeProperty("-webkit-clip-path")
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      {/* High-performance wave canvas overlay */}
      {isActive && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none z-[49]"
        />
      )}

      {/* Main Content container - its clipPath is dynamically updated in the animation loop */}
      <div
        ref={contentRef}
        className="w-full min-h-screen transition-all duration-75"
        style={{ willChange: "clip-path" }}
      >
        {children}
      </div>
    </div>
  )
}
