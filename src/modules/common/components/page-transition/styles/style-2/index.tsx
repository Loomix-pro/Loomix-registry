"use client"

import React, { useEffect, useRef, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

interface GridCell {
  col: number
  row: number
  delay: number
  rotationDir: number
}

export default function PageTransitionStyle3({ children }: PageTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Canvas pixel dimensions from window (fills visible viewport)
    // CSS absolute inset-0 keeps it clipped to the content container
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    // Dynamic grid dimensions based on content width
    const cols = width > 768 ? 18 : 10
    const rows = width > 768 ? 11 : 16

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    const sweepDuration = 1200 // ms
    const startTime = performance.now()
    let animationFrameId: number

    const getThemeColors = () => {
      const primary = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim()

      const waveColor = primary ? `hsla(${primary.replace(/%/g, "")}, 0.5)` : "rgba(120, 119, 198, 0.5)"
      return waveColor
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

    const primaryColor = getThemeColors()
    const themeBg = getThemeBackground()

    // Initialize the grid delay values and rotation directions once
    const grid: GridCell[] = []
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // Delay is based on X sweep + Y stagger + random noise
        const delay = (c / cols) * 0.55 + (r / rows) * 0.15 + Math.random() * 0.25
        grid.push({
          col: c,
          row: r,
          delay,
          rotationDir: Math.random() > 0.5 ? 1 : -1,
        })
      }
    }

    const updateAndDraw = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / sweepDuration, 1)

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      const cellWidth = width / cols
      const cellHeight = height / rows

      for (const cell of grid) {
        const cx = (cell.col + 0.5) * cellWidth
        const cy = (cell.row + 0.5) * cellHeight

        // 1. Calculate Solid Curtain block parameters
        let solidScale = 1
        let solidOpacity = 1
        let solidProgress = 0
        if (progress >= cell.delay) {
          solidProgress = Math.min((progress - cell.delay) / (1 - cell.delay), 1)
          solidScale = Math.max(1 - solidProgress * 1.2, 0) // shrink slightly faster
          solidOpacity = Math.max(1 - solidProgress * 1.5, 0) // fade out faster
        }

        // 2. Calculate Primary Highlight block parameters (dissolves slightly later for a trailing glow)
        const primaryDelay = Math.min(cell.delay + 0.08, 0.95)
        let primaryScale = 1
        let primaryOpacity = 1
        let primaryProgress = 0
        if (progress >= primaryDelay) {
          primaryProgress = Math.min((progress - primaryDelay) / (1 - primaryDelay), 1)
          primaryScale = Math.max(1 - primaryProgress, 0)
          primaryOpacity = Math.max(1 - primaryProgress, 0)
        }

        // --- DRAWING ---

        // Draw primary highlight cell first (will be underneath the solid curtain)
        if (primaryOpacity > 0 && primaryScale > 0) {
          ctx.save()
          ctx.globalAlpha = primaryOpacity
          ctx.fillStyle = primaryColor
          ctx.translate(cx, cy)
          // Rotate organic trail
          ctx.rotate(primaryProgress * Math.PI * 0.2 * cell.rotationDir)
          ctx.fillRect(
            (-cellWidth / 2) * primaryScale,
            (-cellHeight / 2) * primaryScale,
            cellWidth * primaryScale,
            cellHeight * primaryScale
          )
          ctx.restore()
        }

        // Draw solid curtain cell on top
        if (solidOpacity > 0 && solidScale > 0) {
          const isDarkMode = document.documentElement.classList.contains("dark")
          ctx.save()
          ctx.globalAlpha = solidOpacity
          ctx.fillStyle = themeBg
          ctx.translate(cx, cy)
          ctx.rotate(solidProgress * Math.PI * 0.25 * cell.rotationDir)
          ctx.fillRect(
            (-cellWidth / 2) * solidScale,
            (-cellHeight / 2) * solidScale,
            cellWidth * solidScale,
            cellHeight * solidScale
          )

          // Add a subtle border/stroke to make the folding grid cells visible in both light & dark mode
          ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.05)"
          ctx.lineWidth = 1
          ctx.strokeRect(
            (-cellWidth / 2) * solidScale,
            (-cellHeight / 2) * solidScale,
            cellWidth * solidScale,
            cellHeight * solidScale
          )
          ctx.restore()
        }
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateAndDraw)
      } else {
        // Cleanup transition state when animation fully completes
        setIsActive(false)
      }
    }

    animationFrameId = requestAnimationFrame(updateAndDraw)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      {/* Spinning tiles canvas overlay — absolute so it only covers the content area */}
      {isActive && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 w-full h-full pointer-events-none z-[49]"
        />
      )}

      {/* Main Content container */}
      <div className="w-full min-h-screen">
        {children}
      </div>
    </div>
  )
}
