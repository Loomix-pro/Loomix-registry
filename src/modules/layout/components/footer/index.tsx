import React from "react"
import { getTranslations } from "next-intl/server"
import { FooterProps } from "./shared"

import { STYLES as FOOTER_STYLES } from "./registry"

const Footer = async ({ settings, footerNavigation, locale }: FooterProps) => {
  const t = await getTranslations("Layout.footer")
  const isFa = locale !== "en-US"
  const footer = settings?.footer

  const description = footer
    ? (isFa ? footer.description_fa : footer.description_en) ||
      t("brand_description")
    : t("brand_description")

  const copyright = footer
    ? (isFa ? footer.copyright_fa : footer.copyright_en) || t("copyright")
    : t("copyright")

  const activeSocialLinks = footer?.socialLinks?.filter((s) => s.enabled) ?? []

  const brandName =
    footer?.logo?.type === "text" && footer.logo.text
      ? footer.logo.text
      : t("brand_name")

  const footerStyle = (footer?.footerStyle || "style-1").trim().toLowerCase()

  const sharedProps = {
    brandName,
    description,
    copyright,
    activeSocialLinks,
    logo: footer?.logo,
    footerNavigation,
  }

  const DynamicComponent =
    FOOTER_STYLES[footerStyle] || FOOTER_STYLES["style-1"]

  if (!DynamicComponent) return null

  return <DynamicComponent {...sharedProps} />
}

export default Footer
