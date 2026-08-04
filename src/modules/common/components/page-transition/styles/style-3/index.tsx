/**
 * Style 3: Horizontal Swipe Slide
 *
 * Pure CSS page transition. Runs synchronously on first paint before JS hydration,
 * preventing flash or layout shift.
 */
import React from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export default function Style3({ children }: PageTransitionProps) {
  return <div className="page-transition-style3">{children}</div>
}
