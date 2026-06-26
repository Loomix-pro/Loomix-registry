/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/require-await, prefer-const, @typescript-eslint/no-unnecessary-template-expression, @typescript-eslint/no-non-null-asserted-optional-chain, @typescript-eslint/prefer-regexp-exec, @typescript-eslint/use-unknown-in-catch-callback-variable, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-duplicate-type-constituents, @typescript-eslint/no-useless-default-assignment, @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-unused-expressions, @typescript-eslint/no-unnecessary-type-parameters, eqeqeq, @typescript-eslint/no-empty-object-type, @typescript-eslint/non-nullable-type-assertion-style, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { HttpTypes } from "@medusajs/types"
import React, { useState } from "react"
import { useTranslations } from "next-intl"
import CountrySelect from "../components/country-select"
import ProvinceSelect from "../components/province-select"
import CitySelect from "../components/city-select"
import FormField from "../components/form-field"

const BillingAddress = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const t = useTranslations("Checkout")
  const [formData, setFormData] = useState<any>({
    "billing_address.first_name": cart?.billing_address?.first_name || "",
    "billing_address.last_name": cart?.billing_address?.last_name || "",
    "billing_address.address_1": cart?.billing_address?.address_1 || "",
    "billing_address.company": cart?.billing_address?.company || "",
    "billing_address.postal_code": cart?.billing_address?.postal_code || "",
    "billing_address.city": cart?.billing_address?.city || "",
    "billing_address.country_code": cart?.billing_address?.country_code || "",
    "billing_address.province": cart?.billing_address?.province || "",
    "billing_address.phone": cart?.billing_address?.phone || "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormField
          label={t("first_name")}
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
          placeholder={t("first_name_placeholder")}
        />
        <FormField
          label={t("last_name")}
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
          placeholder={t("last_name_placeholder")}
        />
        <CountrySelect
          name="billing_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData["billing_address.country_code"]}
          onChange={handleChange}
          required
          data-testid="billing-country-select"
          fullWidth
        />
        <ProvinceSelect
          name="billing_address.province"
          autoComplete="address-level1"
          countryCode={formData["billing_address.country_code"]}
          value={formData["billing_address.province"]}
          onChange={handleChange}
          data-testid="billing-province-select"
          placeholder={t("province_placeholder")}
          required
          fullWidth
        />
        <CitySelect
          name="billing_address.city"
          autoComplete="address-level2"
          countryCode={formData["billing_address.country_code"]}
          stateCode={formData["billing_address.province"]}
          value={formData["billing_address.city"]}
          onChange={handleChange}
          data-testid="billing-city-select"
          placeholder={t("city_placeholder")}
          required
          fullWidth
        />
        <FormField
          label={t("address")}
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
          placeholder={t("address_placeholder")}
          fullWidth
        />
        <FormField
          label={t("company")}
          name="billing_address.company"
          value={formData["billing_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="billing-company-input"
          placeholder={t("company_placeholder")}
        />
        <FormField
          label={t("postal_code")}
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="billing-postal-input"
          placeholder={t("postal_code_placeholder")}
        />
        <FormField
          label={t("phone")}
          name="billing_address.phone"
          autoComplete="tel"
          value={formData["billing_address.phone"]}
          onChange={handleChange}
          data-testid="billing-phone-input"
          placeholder="Phone"
          required
        />
      </div>
    </>
  )
}

export default BillingAddress
