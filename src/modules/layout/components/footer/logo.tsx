"use client"

import React from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"

const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337"

export const FooterLogo = ({
  logo,
  textClassName = "text-foreground",
}: {
  logo: any
  textClassName?: string
}) => {
  const t = useTranslations("Layout.footer")

  if (!logo) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl">
          {t("brand_name").charAt(0)}
        </div>
        <span className={`text-2xl font-bold ${textClassName} tracking-tight`}>
          {t("brand_name")}
        </span>
      </div>
    )
  }

  if (logo.type === "text" && logo.text) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl">
          {logo.text.charAt(0)}
        </div>
        <span className={`text-2xl font-bold ${textClassName} tracking-tight`}>
          {logo.text}
        </span>
      </div>
    )
  }

  if (logo.type === "image" && logo.image) {
    let imageUrl = ""
    const img = logo.image
    if ("data" in img && img.data?.attributes?.url) {
      imageUrl = img.data.attributes.url
    } else if ("url" in img && img.url) {
      imageUrl = img.url
    }
    if (imageUrl) {
      if (!imageUrl.startsWith("http")) imageUrl = `${STRAPI_URL}${imageUrl}`
      return (
        <Image
          src={imageUrl}
          alt="Logo"
          width={160}
          height={48}
          className="h-12 w-auto object-contain"
        />
      )
    }
  }

  // Ultimate fallback
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl">
        {t("brand_name").charAt(0)}
      </div>
      <span className={`text-2xl font-bold ${textClassName} tracking-tight`}>
        {t("brand_name")}
      </span>
    </div>
  )
}
