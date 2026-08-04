"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function LoadingGridWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleEnd = () => setIsLoading(false)

    window.addEventListener("store-loading-start", handleStart)
    window.addEventListener("store-loading-end", handleEnd)

    return () => {
      window.removeEventListener("store-loading-start", handleStart)
      window.removeEventListener("store-loading-end", handleEnd)
    }
  }, [])

  // Reset loading state when searchParams change, meaning the new page has finished rendering
  useEffect(() => {
    setIsLoading(false)
  }, [searchParams])

  return (
    <>
      {/* Top Progress Indicator Bar */}
      {isLoading && (
        <div className="mb-4 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full overflow-hidden">
          <div className="w-full h-full animate-pulse bg-primary"></div>
        </div>
      )}
      {children}
    </>
  )
}
