"use client"

import { NextIntlClientProvider } from "next-intl"
import { useCallback, useEffect, useState } from "react"

import { LOCALE_CHANGE_EVENT } from "@lib/i18n/locale-change-event"
import defaultMessages from "../../../../../messages/default.json"

const LOCALE_COOKIE = "_medusa_locale"

const LOCAL_MESSAGE_LOADERS: Record<
  string,
  () => Promise<{ default: Record<string, unknown> }>
> = {
  default: () => Promise.resolve({ default: defaultMessages }),
  "en-US": () => import("../../../../../messages/en-US.json"),
  "fa-IR": () => import("../../../../../messages/default.json"),
}

function readLocaleCookie(): string | null {
  if (typeof document === "undefined") {
    return null
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`)
  )

  return match ? decodeURIComponent(match[1]) : null
}

async function loadMessages(locale: string) {
  const loader = LOCAL_MESSAGE_LOADERS[locale] ?? LOCAL_MESSAGE_LOADERS.default

  try {
    const loaded = await loader()
    return loaded.default
  } catch {
    return defaultMessages
  }
}

export default function DynamicIntlProvider({
  children,
  defaultLocale,
  defaultMessages: initialMessages,
  defaultDir,
  timeZone,
}: {
  children: React.ReactNode
  defaultLocale: string
  defaultMessages: Record<string, unknown>
  defaultDir: string
  timeZone: string
}) {
  const [locale, setLocale] = useState(defaultLocale)
  const [messages, setMessages] = useState(initialMessages)
  const [resolvedTimeZone, setResolvedTimeZone] = useState(timeZone)

  // Keep client state aligned with server-resolved locale/messages (e.g. after router.refresh).
  useEffect(() => {
    setLocale(defaultLocale)
    setMessages(initialMessages)
    setResolvedTimeZone(timeZone)
  }, [defaultLocale, initialMessages, timeZone])

  const syncLocaleFromCookie = useCallback(async () => {
    const cookieLocale = readLocaleCookie()
    const resolvedLocale = cookieLocale || defaultLocale
    const nextMessages = await loadMessages(resolvedLocale)

    setLocale(resolvedLocale)
    setMessages(nextMessages)
    document.documentElement.lang = resolvedLocale
    document.documentElement.dir =
      resolvedLocale === "default" && defaultDir === "rtl" ? "rtl" : defaultDir
  }, [defaultDir, defaultLocale])

  // Only react to explicit locale changes — never read cookie on mount (avoids hydration mismatch).
  useEffect(() => {
    const onLocaleChange = () => {
      void syncLocaleFromCookie()
    }

    window.addEventListener(LOCALE_CHANGE_EVENT, onLocaleChange)

    return () => {
      window.removeEventListener(LOCALE_CHANGE_EVENT, onLocaleChange)
    }
  }, [syncLocaleFromCookie])

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={resolvedTimeZone}
    >
      {children}
    </NextIntlClientProvider>
  )
}
