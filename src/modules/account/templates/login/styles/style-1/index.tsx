/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { useState } from "react"
import { UserCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import Login from "./components/login"
import LoginPhone from "./components/login-phone"
import { Otp } from "./components/otp"
import { EmailOtp } from "./components/otp-email"
import { ForgotPassword } from "./components/forgot-password"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  EMAIL_OTP = "email-otp", // email OTP login
  SIGN_IN_PHONE = "sign-in-phone",
  OTP = "otp",
  FORGOT_PASSWORD = "forgot-password",
}

export type AuthMethod = "EMAIL" | "PHONE"
export type LoginMethods = "email" | "phone" | "both"

const LoginTemplate = ({
  loginMethods = "email",
}: {
  loginMethods?: LoginMethods
}) => {
  const showEmail = loginMethods === "email" || loginMethods === "both"
  const showPhone = loginMethods === "phone" || loginMethods === "both"
  const showTabs = loginMethods === "both"

  const defaultView = showPhone ? LOGIN_VIEW.SIGN_IN_PHONE : LOGIN_VIEW.SIGN_IN
  const defaultMethod: AuthMethod = showPhone ? "PHONE" : "EMAIL"

  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(defaultView)
  const [method, setMethod] = useState<AuthMethod>(defaultMethod)
  const [otpPhone, setOtpPhone] = useState("")
  const [otpEmail, setOtpEmail] = useState("")

  const t = useTranslations("Account.Login")

  const handleMethodChange = (m: AuthMethod) => {
    setMethod(m)
    setCurrentView(
      m === "EMAIL" ? LOGIN_VIEW.SIGN_IN : LOGIN_VIEW.SIGN_IN_PHONE
    )
  }

  // Phone OTP flow
  const handleOtpRequired = (phone: string) => {
    setOtpPhone(phone)
    setCurrentView(LOGIN_VIEW.OTP)
  }

  // Email login OTP flow
  const handleEmailOtpRequired = (email: string) => {
    setOtpEmail(email)
    setCurrentView(LOGIN_VIEW.EMAIL_OTP)
  }

  const isLoginView =
    currentView === LOGIN_VIEW.SIGN_IN ||
    currentView === LOGIN_VIEW.SIGN_IN_PHONE

  const getHeaderTitle = () => {
    if (currentView === LOGIN_VIEW.EMAIL_OTP || currentView === LOGIN_VIEW.OTP)
      return t("verify_account") ?? "Verify"
    if (currentView === LOGIN_VIEW.FORGOT_PASSWORD)
      return t("forgot_password") ?? "Forgot Password"
    return t("welcome_back")
  }

  const getHeaderText = () => {
    if (currentView === LOGIN_VIEW.EMAIL_OTP)
      return t("enter_email_otp") ?? "Enter the code sent to your email"
    if (currentView === LOGIN_VIEW.OTP)
      return t("enter_phone_otp") ?? "Enter the code sent to your phone"
    if (currentView === LOGIN_VIEW.FORGOT_PASSWORD)
      return (
        t("forgot_password_text") ?? "Enter your email to receive a reset link"
      )
    return t("sign_in_text")
  }

  return (
    <div className="w-full flex justify-center items-center min-h-[80vh] px-4 py-16">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-gray-100/50 dark:border-zinc-800/50 overflow-hidden">
        <div className="p-8">
          {/* Brand Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-500">
              <UserCircle strokeWidth={1.5} size={28} />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100 mb-2 tracking-tight">
              {getHeaderTitle()}
            </h1>
            <p className="text-sm text-gray-400 dark:text-zinc-500 max-w-[280px] mx-auto leading-relaxed font-light">
              {getHeaderText()}
            </p>
          </div>

          {/* Tab Bar — only when both methods are enabled */}
          {isLoginView && showTabs && (
            <div className="flex bg-gray-50 dark:bg-zinc-950/50 p-1.5 rounded-2xl mb-8 border border-gray-100 dark:border-zinc-800">
              <button
                onClick={() => handleMethodChange("EMAIL")}
                className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  method === "EMAIL"
                    ? "bg-white dark:bg-zinc-800 shadow-md text-blue-600 dark:text-blue-500"
                    : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-400"
                }`}
              >
                {t("email")}
              </button>
              <button
                onClick={() => handleMethodChange("PHONE")}
                className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  method === "PHONE"
                    ? "bg-white dark:bg-zinc-800 shadow-md text-blue-600 dark:text-blue-500"
                    : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-400"
                }`}
              >
                {t("phone")}
              </button>
            </div>
          )}

          {/* Content */}
          <div className="transition-all duration-500 ease-in-out">
            {currentView === LOGIN_VIEW.SIGN_IN && showEmail && (
              <Login
                setCurrentView={setCurrentView}
                onEmailOtpRequired={handleEmailOtpRequired}
              />
            )}
            {currentView === LOGIN_VIEW.SIGN_IN_PHONE && showPhone && (
              <LoginPhone
                setCurrentView={setCurrentView}
                onOtpRequired={handleOtpRequired}
              />
            )}
            {currentView === LOGIN_VIEW.OTP && (
              <Otp
                phone={otpPhone}
                onChangePhone={() => {
                  setCurrentView(LOGIN_VIEW.SIGN_IN_PHONE)
                }}
              />
            )}

            {currentView === LOGIN_VIEW.EMAIL_OTP && (
              <EmailOtp
                email={otpEmail}
                mode="login"
                onChangeEmail={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
              />
            )}
            {currentView === LOGIN_VIEW.FORGOT_PASSWORD && (
              <ForgotPassword
                onBack={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginTemplate
