"use client"

import React, { Suspense, lazy, useMemo } from "react"

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
 *    فقط فایل `styles/style-N.tsx` بساز — هیچ کد اضافه‌ای نیاز نیست!
 *
 * چون این یه Client Component هست، از React.lazy استفاده میکنیم.
 */
export default function BlockHeader(props: BlockHeaderProps) {
  const { style = "style-1" } = props
  const safeStyle = style.trim().toLowerCase().replace(/[^a-z0-9-]/g, "") || "style-1"

  const StyleComponent = useMemo(
    () =>
      lazy(() =>
        import(`./styles/${safeStyle}`).catch(() => import("./styles/style-1"))
      ),
    [safeStyle]
  )

  return (
    <Suspense fallback={null}>
      <StyleComponent {...props} />
    </Suspense>
  )
}
