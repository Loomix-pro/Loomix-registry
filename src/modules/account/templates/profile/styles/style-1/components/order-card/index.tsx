"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { Package, Calendar, CreditCard, ChevronRight } from "lucide-react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/shadcn/button"
import { Badge } from "@modules/common/components/shadcn/badge"
import { toJalali } from "@lib/util/date"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const t = useTranslations("Account.Orders")
  const tStatus = useTranslations("Statuses")

  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + item.quantity
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = order.items?.length ?? 0
  const firstItemTitle = order.items?.[0]?.title ?? ""
  const remainingProductsCount = numberOfProducts - 1
  const itemsSummary =
    remainingProductsCount > 0
      ? `${firstItemTitle} ${t("and_n_other_products", {
          count: remainingProductsCount,
        })}`
      : firstItemTitle

  return (
    <div
      className="bg-white dark:bg-zinc-900 border border-gray-150/60 dark:border-zinc-800/80 p-5 rounded-[24px] hover:border-blue-100 dark:hover:border-zinc-800 hover:shadow-[0_12px_30px_rgba(59,130,246,0.03)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] transition-all duration-300 group"
      data-testid="order-card"
    >
      {/* Top row (Header Stats) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
            {t("order_id")}
          </span>
          <Badge
            variant="secondary"
            className="bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-none px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tight"
          >
            #
            <span data-testid="order-display-id">{order.display_id ?? ""}</span>
          </Badge>
          {(() => {
            const statusVal = order.fulfillment_status ?? order.status
            const key = statusVal?.toLowerCase()
            let label: string = statusVal ?? ""
            if (key && tStatus.has(key)) {
              label = tStatus(key as any)
            } else {
              const formatted = statusVal ? statusVal.split("_").join(" ") : ""
              label = formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
            }

            let badgeClass =
              "bg-blue-50/60 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400"
            if (
              key === "not_fulfilled" ||
              key === "pending" ||
              key === "requires_action" ||
              key === "processing"
            ) {
              badgeClass =
                "bg-amber-50/60 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
            } else if (key === "delivered") {
              badgeClass =
                "bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
            } else if (
              key === "canceled" ||
              key === "cancelled" ||
              key === "returned" ||
              key === "partially_returned"
            ) {
              badgeClass =
                "bg-red-50/60 dark:bg-red-950/20 text-red-600 dark:text-red-400"
            }

            return (
              <Badge
                variant="secondary"
                className={`${badgeClass} border-none px-2.5 py-1 text-[10px] font-bold rounded-lg tracking-tight`}
              >
                {label}
              </Badge>
            )
          })()}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-gray-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 bg-gray-50/60 dark:bg-zinc-800/40 px-2.5 py-1 rounded-xl border border-gray-100/50 dark:border-zinc-850">
            <Calendar size={12} className="text-gray-400 dark:text-zinc-550" />
            <span
              className="text-[10px] font-medium text-gray-600 dark:text-zinc-350"
              data-testid="order-created-at"
            >
              {toJalali(order.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-55/60 dark:bg-zinc-800/40 px-2.5 py-1 rounded-xl border border-gray-100/50 dark:border-zinc-850">
            <CreditCard
              size={12}
              className="text-gray-400 dark:text-zinc-555"
            />
            <span
              className="text-[10px] font-semibold text-gray-800 dark:text-zinc-200"
              data-testid="order-amount"
            >
              {convertToLocale({
                amount: order.total ?? 0,
                currency_code: order.currency_code ?? "",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-55/60 dark:bg-zinc-800/40 px-2.5 py-1 rounded-xl border border-gray-100/50 dark:border-zinc-850">
            <Package size={12} className="text-gray-400 dark:text-zinc-555" />
            <span className="text-[10px] font-medium text-gray-655 dark:text-zinc-350">
              {numberOfLines} {numberOfLines > 1 ? t("items") : t("item")}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gray-100/70 dark:bg-zinc-800/60 mb-4" />

      {/* Bottom row (Products Thumbnails & Details Button) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Overlapping Thumbnails list */}
          <div className="flex -space-x-3.5 rtl:space-x-reverse items-center shrink-0">
            {order.items?.slice(0, 3).map((i) => (
              <div
                key={i.id}
                className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white dark:border-zinc-900 bg-gray-50 dark:bg-zinc-800 shadow-xs hover:-translate-y-0.5 hover:scale-105 transition-all duration-300"
                data-testid="order-item"
              >
                <Thumbnail
                  thumbnail={i.thumbnail}
                  images={[]}
                  size="square"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {numberOfProducts > 3 && (
              <div className="w-11 h-11 rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-900/50 flex items-center justify-center text-[10px] font-bold text-gray-500 dark:text-zinc-400 shadow-xs shrink-0">
                +{numberOfProducts - 3}
              </div>
            )}
          </div>

          {/* Summary item description */}
          <div className="min-w-0 text-left rtl:text-right">
            <p className="text-xs font-semibold text-gray-800 dark:text-zinc-200 truncate leading-snug">
              {itemsSummary}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex justify-end">
          <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
            <Button
              data-testid="order-details-link"
              variant="secondary"
              className="rounded-xl h-9 px-4 text-[10px] font-bold uppercase tracking-wider bg-gray-50 dark:bg-zinc-800 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white transition-all duration-300 flex items-center gap-1.5 group/btn border-none text-gray-750 dark:text-zinc-300 shadow-xs"
            >
              {t("see_details")}
              <ChevronRight
                size={13}
                className="transition-transform group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5"
              />
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default OrderCard
