import React from "react"
import { getTranslations, getLocale } from "next-intl/server"
import { FooterProps } from "./shared"

const Footer = async ({ settings, footerNavigation }: FooterProps) => {
  const t = await getTranslations("Layout.footer")
  const locale = await getLocale()
  const isFa = locale !== "en-US"
  const footer = settings?.footer

  // ── Description: prefer Strapi value for current locale ──────────────────
  const description = footer
    ? (isFa ? footer.description_fa : footer.description_en) ||
      t("brand_description")
    : t("brand_description")

  // ── Copyright: prefer Strapi value for current locale ────────────────────
  const copyright = footer
    ? (isFa ? footer.copyright_fa : footer.copyright_en) || t("copyright")
    : t("copyright")

  // ── Social links: from Strapi (only enabled ones) or fall back to nothing ─
  const activeSocialLinks = footer?.socialLinks?.filter((s) => s.enabled) ?? []

  // ── Brand name for copyright line ─────────────────────────────────────────
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

  let DynamicComponent
  try {
    const mod = await import(`./styles/${footerStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Footer style "${footerStyle}" not found. Error:`, error)
    const fallback = await import(`./styles/style-1`)
    DynamicComponent = fallback.default
  }

  if (!DynamicComponent) return null

  return <DynamicComponent {...sharedProps} />
}

export default Footer
