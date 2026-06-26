/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "./components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div
      className="flex-1 small:py-12 pb-24 md:pb-0"
      data-testid="account-page"
    >
      <div className="flex-1 content-container h-full max-w-5xl mx-auto flex flex-col pt-4 md:pt-0">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 py-8 md:py-12">
          {customer && (
            <div className="md:w-64 shrink-0">
              <AccountNav customer={customer} />
            </div>
          )}
          <div className="flex-1 w-full min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
