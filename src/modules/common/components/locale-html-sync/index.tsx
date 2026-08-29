"use client"

import { useEffect } from "react"
import { isRtlLocale } from "@lib/util/is-rtl"

const LOCALE_COOKIE = "_medusa_locale"

function readLocaleCookie(): string | null {
  if (typeof document === "undefined") {
    return null
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`)
  )

  return match ? decodeURIComponent(match[1]) : null
}

export default function LocaleHtmlSync({
  locale,
  dir,
}: {
  locale: string
  dir: string
}) {
  useEffect(() => {
    const cookieLocale = readLocaleCookie()
    const rawLocale = cookieLocale || locale
    const fallbackLocale =
      process.env.NEXT_PUBLIC_DEFAULT_LOCALE ||
      process.env.DEFAULT_LOCALE ||
      "en-US"
    const resolvedLocale =
      !rawLocale || rawLocale === "default" ? fallbackLocale : rawLocale
    const isRtl = isRtlLocale(resolvedLocale) || dir === "rtl"

    document.documentElement.lang = resolvedLocale
    document.documentElement.dir = isRtl ? "rtl" : "ltr"
  }, [locale, dir])

  return null
}
