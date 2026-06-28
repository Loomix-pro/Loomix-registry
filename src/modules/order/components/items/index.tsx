import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Package } from "lucide-react"

import Item from "@modules/order/components/item"
import SkeletonLineItem from "@/modules/common/skeletons/components/skeleton-line-item"
import { useTranslations } from "next-intl"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items
  const t = useTranslations("Order")

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-6 sm:p-8 rounded-[32px] shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
          <Package size={18} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">
          {t("items")}
        </h3>
      </div>

      <div
        className="divide-y divide-gray-100 dark:divide-zinc-800"
        data-testid="products-table"
      >
        {items?.length
          ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item) => {
              return (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={order.currency_code}
                />
              )
            })
          : repeat(5).map((i) => {
            return <SkeletonLineItem key={i} />
          })}
      </div>
    </div>
  )
}

export default Items
