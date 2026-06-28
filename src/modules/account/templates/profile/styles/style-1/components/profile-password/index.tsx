"use client"

import React from "react"
import { useTranslations } from "next-intl"
import AccountInfo from "../account-info"
import { requestPasswordReset } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const t = useTranslations("Account.Profile")
  const [successState, setSuccessState] = React.useState(false)

  const updatePassword = async () => {
    try {
      if (!customer.email) return
      await requestPasswordReset(customer.email)
      setSuccessState(true)
      toast.success("Password reset link sent to your email.")
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link.")
    }
  }

  const clearState = () => {
    setSuccessState(false)
  }

  return (
    <form
      action={updatePassword}
      onReset={() => clearState()}
      className="w-full"
    >
      <AccountInfo
        label={t("password")}
        currentInfo={<span>{t("password_hint")}</span>}
        isSuccess={successState}
        isError={false}
        errorMessage={undefined}
        clearState={clearState}
        data-testid="account-password-editor"
      >
        <div className="flex flex-col gap-4 text-sm text-gray-500 dark:text-zinc-400 mb-4">
          <p>
            Click save to receive a password reset link at your email address.
          </p>
          <p className="font-semibold text-gray-900 dark:text-zinc-100 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 inline-block w-fit">
            {customer.email}
          </p>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfilePassword
