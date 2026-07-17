"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import SkeletonProductGrid from "@/modules/common/skeletons/templates/skeleton-product-grid"

export default function LoadingGridWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)

    window.addEventListener("store-loading-start", handleStart)
    return () => {
      window.removeEventListener("store-loading-start", handleStart)
    }
  }, [])

  // Reset loading state when searchParams change, meaning the new page has finished rendering
  useEffect(() => {
    setIsLoading(false)
  }, [searchParams])

  if (isLoading) {
    return <SkeletonProductGrid />
  }

  return <>{children}</>
}
