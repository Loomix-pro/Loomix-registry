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
