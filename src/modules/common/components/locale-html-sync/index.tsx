"use client"

import { useEffect } from "react"

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
    const resolvedLocale = cookieLocale || locale
    const resolvedDir =
      resolvedLocale === "default" && dir === "rtl" ? "rtl" : dir

    document.documentElement.lang = resolvedLocale
    document.documentElement.dir = resolvedDir
  }, [locale, dir])

  return null
}
