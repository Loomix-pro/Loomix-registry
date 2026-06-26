/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
import { useTranslations } from "next-intl"
import { ShoppingBag } from "lucide-react"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/shadcn/button"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  const t = useTranslations("Account.Orders")

  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-6 w-full pb-12">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center justify-center min-h-[350px] gap-y-4 bg-white dark:bg-zinc-900 rounded-[32px] border border-gray-100 dark:border-zinc-800/80 shadow-xs hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-100 dark:hover:border-zinc-800 p-8 transition-all duration-500"
      data-testid="no-orders-container"
    >
      <div className="w-16 h-16 bg-blue-50/80 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500 mb-2 group hover:scale-110 transition-transform duration-300">
        <ShoppingBag size={28} className="stroke-[1.5]" />
      </div>
      <div className="text-center space-y-1">
        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-100 tracking-tight">
          {t("no_orders_title")}
        </h2>
        <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-[280px] mx-auto font-light leading-relaxed">
          {t("no_orders_description")}
        </p>
      </div>
      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <Button
            data-testid="continue-shopping-button"
            className="rounded-2xl h-10 px-6 text-[10px] font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 transition-all border-none"
          >
            {t("continue_shopping")}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
