/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import React, { useState, useActionState } from "react"
import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { createReturnRequest } from "@lib/data/returns"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ReturnItemSelector, {
  ReturnItemSelection,
} from "@modules/account/templates/profile/styles/style-1/components/return-item-selector"
import ReturnShippingSelector from "@modules/account/templates/profile/styles/style-1/components/return-shipping-selector"
import { convertToLocale } from "@lib/util/money"
import { enhanceItemsWithReturnStatus } from "@lib/util/returns"
import { Button } from "@medusajs/ui"
import { useTranslations } from "next-intl"

type ReturnRequestTemplateProps = {
  order: HttpTypes.StoreOrder
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  returnReasons: HttpTypes.StoreReturnReason[]
}

const ReturnRequestTemplate: React.FC<ReturnRequestTemplateProps> = ({
  order,
  shippingOptions,
  returnReasons,
}) => {
  const t = useTranslations("Account.Orders")
  const [selectedItems, setSelectedItems] = useState<ReturnItemSelection[]>([])
  const [selectedShippingOption, setSelectedShippingOption] = useState("")
  const [state, formAction] = useActionState(createReturnRequest, {
    success: false,
    error: null,
    return: null,
  })

  // Get all items and categorize them based on delivered quantity and returnable quantity
  const itemsWithDeliveryStatus = enhanceItemsWithReturnStatus(
    order.items || []
  )

  const handleItemSelection = ({
    id,
    quantity,
    return_reason_id,
    note,
  }: ReturnItemSelection) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        if (quantity === 0) {
          return prev.filter((item) => item.id !== id)
        }
        return prev.map((item) => {
          return item.id === id
            ? { ...item, quantity, return_reason_id, note }
            : item
        })
      } else if (quantity > 0) {
        return [...prev, { id, quantity, return_reason_id, note }]
      }
      return prev
    })
  }

  const handleSubmit = (formData: FormData) => {
    formData.append("order_id", order.id)
    formData.append("items", JSON.stringify(selectedItems))
    formData.append("return_shipping_option_id", selectedShippingOption)
    const locationId = (shippingOptions as any[]).find(
      (opt) => opt.id === selectedShippingOption
    )?.service_zone?.fulfillment_set?.location?.id
    formData.append("location_id", locationId)
    formAction(formData)
  }

  if (state.success && state.return) {
    return (
      <div className="flex flex-col justify-center gap-y-4">
        <div className="flex gap-2 justify-between items-center">
          <h1 className="text-2xl-semi">{t("return_submitted")}</h1>
          <LocalizedClientLink
            href="/account/orders"
            className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
          >
            <XMark /> {t("back_to_orders")}
          </LocalizedClientLink>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <div className="text-center">
            <h2 className="text-xl-semi mb-4">{t("return_created_success")}</h2>
            <p className="text-base-regular mb-4">
              {t("return_id_message", {
                id: `#${state.return.id.slice(-7).toUpperCase()}`,
              })}
            </p>
            <p className="text-small-regular text-ui-fg-subtle">
              {t("return_contact_support")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center">
        <h1 className="text-2xl-semi">{t("request_return")}</h1>
        <LocalizedClientLink
          href={`/account/orders/details/${order.id}`}
          className="flex gap-2 items-center text-ui-fg-subtle hover:text-ui-fg-base"
        >
          <XMark /> {t("back_to_details")}
        </LocalizedClientLink>
      </div>

      <div>
        <div className="mb-6">
          <h2 className="text-xl-semi mb-2">
            {t("order_number", { id: order.display_id ?? "" })}
          </h2>
          <div className="flex items-center gap-4 text-small-regular text-ui-fg-subtle mb-4">
            <span>
              {t("ordered_date", {
                date: order.created_at
                  ? new Date(order.created_at).toDateString()
                  : "",
              })}
            </span>
            <span>
              {t("order_total_val", {
                total: convertToLocale({
                  amount: order.total ?? 0,
                  currency_code: order.currency_code,
                }),
              })}
            </span>
          </div>
          <p className="text-base-regular text-ui-fg-subtle">
            {t("return_instructions")}
          </p>
        </div>

        {itemsWithDeliveryStatus.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-base-regular text-ui-fg-subtle">
              {t("no_items_available")}
            </p>
          </div>
        ) : (
          <form action={handleSubmit} className="space-y-6">
            <div>
              <h3 className="txt-medium-plus mb-4">{t("items_to_return")}</h3>
              <ReturnItemSelector
                items={itemsWithDeliveryStatus}
                returnReasons={returnReasons}
                onItemSelectionChange={handleItemSelection}
                selectedItems={selectedItems}
                currencyCode={order.currency_code}
              />
            </div>

            <div>
              <h3 className="txt-medium-plus mb-4">{t("choose_shipping")}</h3>
              <ReturnShippingSelector
                shippingOptions={shippingOptions}
                selectedOption={selectedShippingOption}
                onOptionSelect={setSelectedShippingOption}
                cartId={(order as any).cart.id}
                currencyCode={order.currency_code}
              />
            </div>

            {state.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{state.error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={
                  selectedItems.length === 0 || selectedShippingOption === ""
                }
              >
                {t("request_return")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ReturnRequestTemplate
