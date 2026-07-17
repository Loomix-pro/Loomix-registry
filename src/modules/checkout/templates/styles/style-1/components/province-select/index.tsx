"use client"

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"
import { useTranslations } from "next-intl"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { State } from "country-state-city"
import iranCity from "iran-city"

import { isIranFeaturesEnabled } from "@lib/util/storefront-settings"

const ProvinceSelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    countryCode?: string
  }
>(({ placeholder, countryCode, defaultValue, ...props }, ref) => {
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

    if (isIranFeaturesEnabled && countryCode.toLowerCase() === "ir") {
      return iranCity.allProvinces().map((state: any) => ({
        value: state.name,
        label: state.name,
      }))
    }

    return State.getStatesOfCountry(countryCode.toUpperCase()).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }))
  }, [countryCode])

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={provincePlaceholder}
      defaultValue={defaultValue}
      {...props}
    >
      {provinceOptions.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  )
})

ProvinceSelect.displayName = "ProvinceSelect"

export default ProvinceSelect
