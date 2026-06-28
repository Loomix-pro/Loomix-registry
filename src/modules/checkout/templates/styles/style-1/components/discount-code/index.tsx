"use client"

import { Badge, Heading, Text } from "@medusajs/ui"
import { useTranslations } from "next-intl"
import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const t = useTranslations("Checkout")
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      (promotion) => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")

    const code = formData.get("code")
    if (!code) {
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="txt-medium">
        <form action={(a) => addPromotionCode(a)} className="w-full mb-5">
          <div className="flex gap-x-1 my-2 items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="flex items-center gap-x-2 txt-medium text-ui-fg-base hover:text-ui-fg-subtle transition-colors"
              data-testid="add-discount-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                />
              </svg>
              {t("add_promotion")}
            </button>
          </div>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="relative w-full mt-2 group shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl">
                <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-4 rtl:pr-4 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                    />
                  </svg>
                </div>
                <input
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={false}
                  data-testid="discount-input"
                  className="w-full h-14 ltr:pl-11 ltr:pr-24 rtl:pr-11 rtl:pl-24 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm transition-all focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-4 focus:ring-blue-500/10 text-gray-800 dark:text-zinc-200 placeholder:text-gray-400 font-mono uppercase tracking-widest"
                  placeholder={t("discount_code_placeholder")}
                />
                <div className="absolute inset-y-1.5 ltr:right-1.5 rtl:left-1.5">
                  <SubmitButton
                    variant="secondary"
                    className="h-full px-5 rounded-xl bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 font-semibold text-xs transition-all active:scale-95 shadow-sm !m-0 !py-0 flex items-center justify-center"
                    data-testid="discount-apply-button"
                  >
                    {t("apply")}
                  </SubmitButton>
                </div>
              </div>

              <ErrorMessage
                error={errorMessage}
                data-testid="discount-error-message"
              />
            </div>
          </div>
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium mb-2">
                {t("promotions_applied")}
              </Heading>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                          size="small"
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {promotion.application_method.type ===
                              "percentage"
                                ? `${promotion.application_method.value}%`
                                : convertToLocale({
                                    amount: +promotion.application_method.value,
                                    currency_code:
                                      promotion.application_method
                                        .currency_code,
                                  })}
                            </>
                          )}
                        )
                        {/* {promotion.is_automatic && (
                          <Tooltip content="This promotion is automatically applied">
                            <InformationCircleSolid className="inline text-zinc-400" />
                          </Tooltip>
                        )} */}
                      </span>
                    </Text>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">{t("remove_promotion")}</span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
