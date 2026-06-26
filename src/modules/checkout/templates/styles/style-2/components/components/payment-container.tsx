/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { Radio as RadioGroupOption } from "@headlessui/react"
import { clx, Text } from "@medusajs/ui"
import React, { useContext, useMemo, type JSX } from "react"
import { CheckCircleSolid } from "@medusajs/icons"

import { isManual } from "@lib/constants"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import { StripeContext } from "@modules/checkout/components/payment-wrapper/stripe-wrapper"

// Reusing PaymentTest from style-1 or redefining simple badge
const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <div
      className={clx(
        "mt-2 py-2 px-3 bg-ui-tag-orange-bg border border-ui-tag-orange-border rounded-lg w-fit",
        className
      )}
    >
      <p className="text-[10px] text-ui-tag-orange-text font-bold uppercase italic">
        Test Mode Only
      </p>
    </div>
  )
}

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const isSelected = selectedPaymentOptionId === paymentProviderId

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={({ checked }) =>
        clx(
          "p-8 border-2 rounded-3xl flex flex-col gap-6 relative overflow-hidden group cursor-pointer transition-all bg-muted/30 dark:bg-zinc-900/50",
          {
            "border-ui-border-interactive bg-ui-bg-base dark:bg-zinc-800":
              checked,
            "border-ui-border-base hover:border-ui-border-strong": !checked,
            "opacity-50 cursor-not-allowed": disabled,
          }
        )
      }
    >
      {({ checked }) => (
        <>
          {checked && (
            <div className="absolute top-4 right-4 text-primary">
              <CheckCircleSolid className="w-6 h-6" />
            </div>
          )}
          <div className="w-12 h-12 bg-background border border-border rounded-xl shadow-sm flex items-center justify-center text-foreground dark:bg-zinc-700">
            {paymentInfoMap[paymentProviderId]?.icon}
          </div>
          <div>
            <p className="font-bold text-lg">
              {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
            </p>
            {/* <p className="text-xs text-gray-500 mt-1">Description if available</p> */}
          </div>
          {isManual(paymentProviderId) && isDevelopment && <PaymentTest />}
          {children}
        </>
      )}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "hsl(var(--foreground))",
          "::placeholder": {
            color: "hsl(var(--muted-foreground))",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out dark:bg-zinc-800 dark:border-zinc-700",
      },
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="mt-4 transition-all duration-150 ease-in-out">
            <Text className="txt-medium-plus text-foreground mb-1">
              Enter your card details:
            </Text>
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={(e) => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}
