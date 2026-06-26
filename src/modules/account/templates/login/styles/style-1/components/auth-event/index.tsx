/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { useEffect, useRef } from "react"
import { sendGTMEvent } from "@next/third-parties/google"
import { HttpTypes } from "@medusajs/types"

type AuthEventProps = {
  customer: HttpTypes.StoreCustomer | null
}

export default function AuthEvent({ customer }: AuthEventProps) {
  const hasFiredFor = useRef<string | null>(null)

  useEffect(() => {
    // If no customer, skip.
    if (!customer) return

    // Prevent firing on every visit to the dashboard during the same session
    const sessionKey = `auth_event_fired_${customer.id}`

    // Check if we already fired it in this tab session or React strict mode
    if (
      hasFiredFor.current === customer.id ||
      sessionStorage.getItem(sessionKey)
    ) {
      return
    }

    hasFiredFor.current = customer.id
    sessionStorage.setItem(sessionKey, "true")

    // Check if the user was created very recently (within the last 15 seconds)
    // Medusa's created_at and updated_at might differ slightly based on DB triggers
    const createdAt = new Date(customer.created_at || Date.now()).getTime()
    const updatedAt = new Date(customer.updated_at || Date.now()).getTime()
    const timeSinceCreation = Date.now() - createdAt
    const isNewUser =
      timeSinceCreation < 15000 && Math.abs(updatedAt - createdAt) < 15000

    if (isNewUser) {
      sendGTMEvent({
        event: "sign_up",
        method: customer.metadata?.login_method || "phone", // phone or email
      })
    } else {
      sendGTMEvent({
        event: "login",
        method: customer.metadata?.login_method || "phone", // phone or email
      })
    }
  }, [customer])

  return null
}
