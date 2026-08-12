"use client"

import React, { Suspense, lazy, useMemo } from "react"

import { STYLES } from "./registry"

export interface BlockHeaderProps {
  title?: string
  /** Short badge label shown above the title (replaces old 'subtitle') */
  badge?: string
  description?: string
  linkText?: string
  linkHref?: string
  badgeIcon?: React.ReactNode
  style?: string
}

/**
 * Dynamic BlockHeader
 *
 * ✅ برای اضافه کردن style جدید:
 *    فقط فایل `styles/style-N.tsx` بساز — اسکریپت ما بقیه کارها رو انجام میده!
 */
export default function BlockHeader(props: BlockHeaderProps) {
  const { style = "style-1" } = props
  const safeStyle =
    style
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") || "style-1"

  const StyleComponent = STYLES[safeStyle] || STYLES["style-1"]

  if (!StyleComponent) return null

  return (
    <Suspense fallback={null}>
      <StyleComponent {...props} />
    </Suspense>
  )
}
