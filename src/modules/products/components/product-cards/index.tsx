"use client"

import { Suspense, lazy, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"

export type ProductCardType = string

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

/**
 * Dynamic Product Card (Client Component)
 *
 * ✅ برای اضافه کردن کارت جدید:
 *    فقط فایل `cards/card-N.tsx` بساز — هیچ کد اضافه‌ای نیاز نیست!
 *
 * چون card ها از hooks استفاده میکنن (use client)، اینجا از React.lazy استفاده میکنیم.
 * Security: فقط حروف، عدد، و `-` قبول میشه.
 */
export default function ProductCard({
  product,
  region,
  cardType = "card-1",
}: ProductCardProps & { cardType?: ProductCardType }) {
  const safeType = cardType.replace(/[^a-z0-9-]/gi, "") || "card-1"

  const CardComponent = useMemo(
    () =>
      lazy(() =>
        import(`./cards/${safeType}`).catch(() => import("./cards/card-1"))
      ),
    [safeType]
  )

  return (
    <Suspense fallback={null}>
      <CardComponent product={product} region={region} />
    </Suspense>
  )
}