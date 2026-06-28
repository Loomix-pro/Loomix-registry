"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export type SortOptions = "created_at" | "price_asc" | "price_desc"

interface SortBarProps {
  count: number
  sortBy: SortOptions
}

export function SortBar({ count, sortBy }: SortBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations("Store.sort_bar")

  const handleSortChange = (value: SortOptions) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
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
        <span className="text-foreground">{count.toLocaleString()}</span>{" "}
        {t("products")}
      </p>

      <div className="flex items-center gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
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
