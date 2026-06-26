/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string , @typescript-eslint/no-require-imports, @typescript-eslint/require-await, prefer-const, @typescript-eslint/no-unnecessary-template-expression, @typescript-eslint/no-non-null-asserted-optional-chain, @typescript-eslint/prefer-regexp-exec, @typescript-eslint/use-unknown-in-catch-callback-variable, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-duplicate-type-constituents, @typescript-eslint/no-useless-default-assignment, @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unnecessary-type-parameters, eqeqeq, @typescript-eslint/no-empty-object-type, @typescript-eslint/non-nullable-type-assertion-style */
"use client"

import React, { useEffect, useState } from "react"
import { RadioGroup } from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { convertToLocale } from "@lib/util/money"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { Loader } from "@medusajs/icons"
import Radio from "@modules/common/components/radio"
import { useTranslations } from "next-intl"

type ReturnShippingSelectorProps = {
  shippingOptions: HttpTypes.StoreCartShippingOption[]
  selectedOption: string
  onOptionSelect: (optionId: string) => void
  cartId: string
  currencyCode: string
}

const ReturnShippingSelector: React.FC<ReturnShippingSelectorProps> = ({
  shippingOptions,
  selectedOption,
  onOptionSelect,
  cartId,
  currencyCode,
}) => {
  const t = useTranslations("Account.Orders")
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})

  useEffect(() => {
    setIsLoadingPrices(true)

    if (shippingOptions?.length) {
      const promises = shippingOptions
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cartId))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    } else {
      setIsLoadingPrices(false)
    }
  }, [shippingOptions, cartId])

  if (shippingOptions.length === 0) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
        <p className="text-yellow-800 text-sm">{t("no_shipping_options")}</p>
      </div>
    )
  }

  return (
    <RadioGroup value={selectedOption} onChange={onOptionSelect}>
      <div className="space-y-3">
        {shippingOptions.map((option) => (
          <RadioGroup.Option
            key={option.id}
            value={option.id}
            className={clx(
              "p-4 border rounded-lg cursor-pointer transition-colors",
              {
                "border-ui-fg-interactive bg-ui-bg-interactive/5":
                  selectedOption === option.id,
                "border-gray-200 hover:border-gray-300":
                  selectedOption !== option.id,
              }
            )}
          >
            <div className="flex items-center gap-3">
              <Radio
                checked={selectedOption === option.id}
                data-testid={`shipping-option-${option.id}`}
              />

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="txt-medium">{option.name}</h4>
                  <span className="txt-medium">
                    {option.price_type === "flat" ? (
                      convertToLocale({
                        amount: option.amount!,
                        currency_code: currencyCode,
                      })
                    ) : calculatedPricesMap[option.id] ? (
                      convertToLocale({
                        amount: calculatedPricesMap[option.id],
                        currency_code: currencyCode,
                      })
                    ) : isLoadingPrices ? (
                      <Loader />
                    ) : (
                      "-"
                    )}
                  </span>
                </div>

                {option.data &&
                  typeof option.data === "object" &&
                  option.data !== null &&
                  "description" in option.data && (
                    <p className="txt-small mt-1">
                      {String(option.data.description)}
                    </p>
                  )}
              </div>
            </div>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  )
}

export default ReturnShippingSelector
