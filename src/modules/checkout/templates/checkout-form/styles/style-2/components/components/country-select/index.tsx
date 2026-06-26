/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import SelectField from "../select-field"
import { HttpTypes } from "@medusajs/types"
import { useLocale, useTranslations } from "next-intl"

const CountrySelect = forwardRef<
  HTMLSelectElement,
  {
    placeholder?: string
    region?: HttpTypes.StoreRegion
    defaultValue?: string
    name?: string
    required?: boolean
    value?: string
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    "data-testid"?: string
    autoComplete?: string
    fullWidth?: boolean
  }
>(
  (
    {
      placeholder = "Country",
      region,
      defaultValue,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    const locale = useLocale()
    const t = useTranslations("Checkout")
    const innerRef = useRef<HTMLSelectElement>(null)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    const countryOptions = useMemo(() => {
      if (!region) {
        return []
      }

      const isFa = locale.startsWith("fa") || locale === "default"

      return region.countries?.map((country) => ({
        value: country.iso_2,
        label:
          country.iso_2?.toLowerCase() === "ir"
            ? t("iran")
            : country.display_name,
      }))
    }, [region, locale, t])

    return (
      <SelectField
        ref={innerRef}
        label="Country / Region"
        defaultValue={defaultValue}
        fullWidth={fullWidth}
        {...props}
      >
        <option value="">{placeholder}</option>
        {countryOptions?.map(({ value, label }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </SelectField>
    )
  }
)

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
