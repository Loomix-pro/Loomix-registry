/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import { useTranslations } from "next-intl"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { City } from "country-state-city"
import iranCity from "iran-city"

const CitySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    countryCode?: string
    stateCode?: string
  }
>(({ placeholder, countryCode, stateCode, defaultValue, ...props }, ref) => {
  const t = useTranslations("Checkout")
  const innerRef = useRef<HTMLSelectElement>(null)

  const cityPlaceholder = placeholder || t("city")

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  )

  const cityOptions = useMemo<{ value: string; label: string }[]>(() => {
    if (!countryCode || !stateCode) {
      return []
    }

    if (countryCode.toLowerCase() === "ir") {
      const province = iranCity
        .allProvinces()
        .find((p: any) => p.name === stateCode)
      if (province) {
        return iranCity.citiesOfProvince(province.id).map((city: any) => ({
          value: city.name,
          label: city.name,
        }))
      }
      return []
    }

    return City.getCitiesOfState(countryCode.toUpperCase(), stateCode).map(
      (city) => ({
        value: city.name,
        label: city.name,
      })
    )
  }, [countryCode, stateCode])

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={cityPlaceholder}
      defaultValue={defaultValue}
      {...props}
    >
      {cityOptions.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  )
})

CitySelect.displayName = "CitySelect"

export default CitySelect
