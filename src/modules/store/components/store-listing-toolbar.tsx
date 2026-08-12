"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSyncExternalStore } from "react"
import { useTranslations } from "next-intl"

import {
  getStoreFilterLoading,
  navigateWithStoreLoading,
  subscribeStoreFilterLoading,
} from "./store-filter-loading"
import {
  getStoreProductCount,
  subscribeStoreProductCount,
} from "./store-product-count-cache"

export type SortOptions = "created_at" | "price_asc" | "price_desc"

export function SortBar({
  count: countProp,
  sortBy: sortByProp,
}: {
  count?: number
  sortBy?: SortOptions
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("Store.sort_bar")

  const isFiltering = useSyncExternalStore(
    subscribeStoreFilterLoading,
    getStoreFilterLoading,
    () => false
  )

  const cachedCount = useSyncExternalStore(
    subscribeStoreProductCount,
    getStoreProductCount,
    () => 0
  )

  const sortBy =
    sortByProp ??
    ((searchParams.get("sortBy") as SortOptions | null) || "created_at")

  const count = countProp ?? cachedCount

  const handleSortChange = (value: SortOptions) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    params.delete("page")
    navigateWithStoreLoading(router, `${pathname}?${params.toString()}`)
  }

  const sortOptions: { value: SortOptions; label: string }[] = [
    { value: "created_at", label: t("newest") },
    { value: "price_asc", label: t("price_asc") },
    { value: "price_desc", label: t("price_desc") },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 mb-8 rounded-xl bg-card border border-border/50 shadow-sm">
      <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
        {t("showing")}{" "}
        <span
          className={`text-foreground transition-opacity ${isFiltering ? "opacity-50" : ""}`}
        >
          {count.toLocaleString()}
        </span>{" "}
        {t("products")}
      </p>

      <div className="flex items-center gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSortChange(option.value)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${
              sortBy === option.value
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "text-muted-foreground border-transparent hover:bg-muted"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function StoreListingToolbar() {
  return <SortBar />
}
