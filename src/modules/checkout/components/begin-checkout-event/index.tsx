/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { useEffect, useRef } from "react"
import { sendGTMEvent } from "@next/third-parties/google"
import { HttpTypes } from "@medusajs/types"

type BeginCheckoutEventProps = {
  cart: HttpTypes.StoreCart
}

export default function BeginCheckoutEvent({ cart }: BeginCheckoutEventProps) {
  const hasFiredFor = useRef<string | null>(null)

  useEffect(() => {
    if (!cart || !cart.items?.length || hasFiredFor.current === cart.id) return
    hasFiredFor.current = cart.id

    sendGTMEvent({
      event: "begin_checkout",
      ecommerce: {
        currency: cart.currency_code?.toUpperCase() || "IRR",
        value: cart.total || 0,
        items: cart.items.map((item) => ({
          item_id: item.variant?.product_id || item.id,
          item_variant_id: item.variant_id,
          item_name: item.product_title || item.title,
          price: item.unit_price || 0,
          quantity: item.quantity,
        })),
      },
    })
  }, [cart])

  return null
}
