/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import { ArrowLeft } from "@medusajs/icons"
import PaymentButton from "../payment-button"
import { useTranslations } from "next-intl"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { getNextIncompleteStep } from "../components/checkout-step"

const Review = ({ cart }: { cart: any }) => {
  const t = useTranslations("Checkout")
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentStep =
    searchParams.get("step") || (cart ? getNextIncompleteStep(cart) : null)
  const isOpen = currentStep === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isOpen && previousStepsCompleted && (
        <section>
          <div>
            <Heading
              level="h2"
              className="text-2xl font-bold tracking-tight mb-2 text-foreground"
            >
              {t("final_review")}
            </Heading>
            <p className="text-muted-foreground text-sm">
              {t("final_review_description")}
            </p>
          </div>

          <div className="mt-6 space-y-4 text-foreground">
            <div className="bg-accent/50 p-6 rounded-3xl border border-dashed border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-bold uppercase text-[10px] text-muted-foreground tracking-widest mb-3">
                    {t("shipping_to")}
                  </h4>
                  <p className="font-medium text-foreground">
                    {cart.shipping_address.first_name}{" "}
                    {cart.shipping_address.last_name}
                  </p>
                  <p className="text-muted-foreground">
                    {cart.shipping_address.address_1}
                    {cart.shipping_address.address_2 &&
                      `, ${cart.shipping_address.address_2}`}
                  </p>
                  <p className="text-muted-foreground">
                    {cart.shipping_address.postal_code},{" "}
                    {cart.shipping_address.city}
                  </p>
                  <p className="text-muted-foreground">
                    {cart.shipping_address.country_code?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <h4 className="font-bold uppercase text-[10px] text-muted-foreground tracking-widest mb-3">
                    {t("billing_info")}
                  </h4>
                  {/* We might need to check if billing same as shipping conceptually, but checking logic: */}
                  {cart.billing_address ? (
                    <>
                      <p className="font-medium text-foreground">
                        {cart.billing_address.first_name}{" "}
                        {cart.billing_address.last_name}
                      </p>
                      <p className="text-muted-foreground">
                        {cart.billing_address.address_1}
                        {cart.billing_address.address_2 &&
                          `, ${cart.billing_address.address_2}`}
                      </p>
                      <p className="text-muted-foreground">
                        {cart.billing_address.postal_code},{" "}
                        {cart.billing_address.city}
                      </p>
                      <p className="text-muted-foreground">
                        {cart.billing_address.country_code?.toUpperCase()}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">
                      {t("same_as_shipping")}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl dark:bg-blue-900/10 dark:border-blue-800/20">
              <p className="text-xs text-blue-700 leading-relaxed dark:text-blue-400">
                {t.rich("terms_full", {
                  tos: (chunks) => (
                    <span className="font-bold underline cursor-pointer text-blue-800 dark:text-blue-300">
                      {chunks}
                    </span>
                  ),
                  rp: (chunks) => (
                    <span className="font-bold underline cursor-pointer text-blue-800 dark:text-blue-300">
                      {chunks}
                    </span>
                  ),
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          </div>
        </section>
      )}
    </div>
  )
}

export default Review
