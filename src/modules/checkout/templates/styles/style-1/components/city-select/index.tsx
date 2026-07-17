"use client"

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import { useTranslations } from "next-intl"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { City } from "country-state-city"
import iranCity from "iran-city"

import { isIranFeaturesEnabled } from "@lib/util/storefront-settings"

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

    if (isIranFeaturesEnabled && countryCode.toLowerCase() === "ir") {
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
