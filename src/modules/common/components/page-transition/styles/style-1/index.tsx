/**
 * Style 1: Radial Circular Reveal
 *
 * Pure CSS page transition. Runs synchronously on first paint before JS hydration,
 * preventing flash or layout shift.
 */
import React from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export default function Style1({ children }: PageTransitionProps) {
  return <div className="page-transition-style1">{children}</div>
}
