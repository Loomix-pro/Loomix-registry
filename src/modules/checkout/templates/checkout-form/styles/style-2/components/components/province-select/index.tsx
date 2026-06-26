/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import { useTranslations } from "next-intl"

import SelectField from "../select-field"
import { State } from "country-state-city"
import iranCity from "iran-city"

const ProvinceSelect = forwardRef<
  HTMLSelectElement,
  {
    placeholder?: string
    countryCode?: string
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
    { placeholder, countryCode, defaultValue, fullWidth = false, ...props },
    ref
  ) => {
    const t = useTranslations("Checkout")
    const innerRef = useRef<HTMLSelectElement>(null)

    const provincePlaceholder = placeholder || t("province")

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    const provinceOptions = useMemo<{ value: string; label: string }[]>(() => {
      if (!countryCode) {
        return []
      }

      if (countryCode.toLowerCase() === "ir") {
        return iranCity.allProvinces().map((state: any) => ({
          value: state.name,
          label: state.name,
        }))
      }

      return State.getStatesOfCountry(countryCode.toUpperCase()).map(
        (state) => ({
          value: state.isoCode,
          label: state.name,
        })
      )
    }, [countryCode])

    return (
      <SelectField
        ref={innerRef}
        label={t("province")}
        defaultValue={defaultValue}
        fullWidth={fullWidth}
        {...props}
      >
        <option value="">{provincePlaceholder}</option>
        {provinceOptions.map(({ value, label }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </SelectField>
    )
  }
)

ProvinceSelect.displayName = "ProvinceSelect"

export default ProvinceSelect
