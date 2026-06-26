/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { HttpTypes } from "@medusajs/types"
import StepIndicator from "../step-indicator"
import { useTranslations } from "next-intl"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { getNextIncompleteStep } from "../checkout-step"

type CheckoutProgressProps = {
  cart: HttpTypes.StoreCart
}

const CheckoutProgress = ({ cart }: CheckoutProgressProps) => {
  const t = useTranslations("Checkout")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const stepOrder = ["address", "delivery", "payment", "review"]

  const currentStep = searchParams.get("step") || getNextIncompleteStep(cart)

  const handleStepChange = (step: string) => {
    if (stepOrder.indexOf(step) < stepOrder.indexOf(currentStep)) {
      router.push(pathname + "?step=" + step)
    }
  }

  return (
    <div className="flex flex-wrap gap-8 border-b border-border pb-8 overflow-x-auto">
      <StepIndicator
        label={t("shipping_address")}
        step="address"
        currentStep={currentStep}
        active={true}
        onStepChange={handleStepChange}
        index={1}
        disabled={false}
      />
      <StepIndicator
        label={t("delivery")}
        step="delivery"
        currentStep={currentStep}
        active={!!cart.shipping_address}
        onStepChange={handleStepChange}
        index={2}
        disabled={stepOrder.indexOf(currentStep) < 1}
      />
      <StepIndicator
        label={t("payment")}
        step="payment"
        currentStep={currentStep}
        active={
          !!cart.shipping_address && (cart.shipping_methods?.length ?? 0) > 0
        }
        onStepChange={handleStepChange}
        index={3}
        disabled={stepOrder.indexOf(currentStep) < 2}
      />
      <StepIndicator
        label={t("review")}
        step="review"
        currentStep={currentStep}
        active={
          !!cart.shipping_address &&
          (cart.shipping_methods?.length ?? 0) > 0 &&
          !!cart.payment_collection
        }
        onStepChange={handleStepChange}
        index={4}
        disabled={stepOrder.indexOf(currentStep) < 3}
      />
    </div>
  )
}

export default CheckoutProgress
