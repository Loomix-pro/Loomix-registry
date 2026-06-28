"use client"

import { useEffect } from "react"
import { syncCartCurrency } from "@lib/data/cart"

export default function CartCurrencySync({ cart }: { cart: any }) {
  useEffect(() => {
    if (
      cart &&
      cart.region &&
      cart.currency_code !== cart.region.currency_code
    ) {
      syncCartCurrency()
    }
  }, [cart])

  return null
}
