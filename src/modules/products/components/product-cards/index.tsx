"use client"

import { ComponentType, LazyExoticComponent, Suspense, lazy } from "react"
import { HttpTypes } from "@medusajs/types"
import { ProductReviewSummary } from "@/types/global"

export type ProductCardType = string

interface ProductCardProps {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  /** Pre-fetched on the server to avoid per-card server action POSTs */
  reviewSummary?: ProductReviewSummary | null
}

const cardComponentCache = new Map<
  string,
  LazyExoticComponent<ComponentType<ProductCardProps>>
>()

function getCardComponent(safeType: string) {
  if (!cardComponentCache.has(safeType)) {
    cardComponentCache.set(
      safeType,
      lazy(() =>
        import(`./cards/${safeType}`).catch(() => import("./cards/card-1"))
      )
    )
  }

  return cardComponentCache.get(safeType)!
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
  reviewSummary,
}: ProductCardProps & { cardType?: ProductCardType }) {
  const safeType = cardType.replace(/[^a-z0-9-]/gi, "") || "card-1"
  const CardComponent = getCardComponent(safeType)

  return (
    <Suspense fallback={null}>
      <CardComponent
        product={product}
        region={region}
        reviewSummary={reviewSummary}
      />
    </Suspense>
  )
}
