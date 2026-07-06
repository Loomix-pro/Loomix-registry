"use client"

import React, { useState, useEffect } from "react"

export default function GlobalLoading() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true)
    }, 250)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Placeholder to prevent layout collapse and footer jump */}
      <div className="min-h-[70vh] w-full" />

      {/* Full screen solid overlay */}
      {show && (
        <div className="fixed inset-0 flex items-center justify-center h-[100dvh] w-[100dvw] bg-background z-[999999] animate-in fade-in duration-300">
          <div className="flex flex-col items-center justify-center space-y-8 animate-pulse">

            {/* Animated Logo Box */}
            <div className="relative flex items-center justify-center w-24 h-24 bg-foreground text-background rounded-[1.5rem] shadow-2xl">
              <div className="absolute inset-0 bg-foreground opacity-30 rounded-[1.5rem] animate-ping" style={{ animationDuration: '2s' }} />
              <span className="font-extrabold text-5xl tracking-tighter relative z-10">L</span>
            </div>

            {/* Text Logo */}
            <div className="flex items-center tracking-[0.2em] text-2xl uppercase font-bold">
              <span className="text-foreground">Luxury</span>
              <span className="text-muted-foreground font-medium ml-1">Shop</span>
            </div>

            {/* Elegant loading dots */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 rounded-full bg-foreground/80 animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>

          </div>
        </div>
      )}
    </>
  )
}
