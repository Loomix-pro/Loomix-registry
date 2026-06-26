/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Mail, CheckCircle } from "lucide-react"
import { Button } from "@medusajs/ui"
import { requestPasswordReset } from "@lib/data/customer"

type Props = {
  onBack: () => void
}

export const ForgotPassword = ({ onBack }: Props) => {
  const t = useTranslations("Account.ForgotPassword")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    setError(undefined)

    await requestPasswordReset(email)

    // Always show success (security: don't reveal if email exists)
    setSent(true)
    setIsLoading(false)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-14 h-14 bg-green-500/10 rounded-full border border-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {t("email_sent_title")}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed">
            {t("email_sent_description", { email })}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
        >
          {t("back_to_login")}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="relative">
        <input
          type="email"
          id="reset-email-s2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder=" "
          autoComplete="email"
          className="peer w-full border border-gray-200 dark:border-zinc-700/50 rounded-xl px-4 pt-5 pb-2 text-sm text-gray-900 dark:text-zinc-100 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-all placeholder:text-transparent"
        />
        <label
          htmlFor="reset-email-s2"
          className="absolute top-2 ltr:left-4 rtl:right-4 text-[10px] font-semibold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-zinc-500 transition-all pointer-events-none"
        >
          {t("email_label")}
        </label>
        <Mail className="absolute ltr:right-4 rtl:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl shadow-lg shadow-indigo-500/25 border-0 transition-all duration-300 hover:scale-[1.02]"
      >
        {isLoading ? t("sending") : t("send_reset_link")}
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="text-sm text-zinc-500 hover:text-indigo-400 transition-colors text-center mt-1"
      >
        {t("back_to_login")}
      </button>
    </form>
  )
}

export default ForgotPassword
