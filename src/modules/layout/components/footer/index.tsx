

import React from "react"
import {
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Phone,
} from "lucide-react"

import { getTranslations, getLocale } from "next-intl/server"
import type {
  StorefrontSettings,
  SocialPlatform,
  SocialLink,
} from "@lib/data/strapi-settings"


export type FooterProps = {
  settings?: StorefrontSettings
  footerNavigation?: any[]
}

export type FooterStyleComponentProps = {
  brandName: string
  description: string
  copyright: string
  activeSocialLinks: SocialLink[]
  logo?: any
  footerNavigation?: any[]
}

// Platform → Lucide icon mapping
export const SOCIAL_ICONS: Record<SocialPlatform, React.ReactNode> = {
  twitter: <Twitter className="w-5 h-5 text-white" />,
  github: <Github className="w-5 h-5 text-white" />,
  linkedin: <Linkedin className="w-5 h-5 text-white" />,
  facebook: <Facebook className="w-5 h-5 text-white" />,
  instagram: <Instagram className="w-5 h-5 text-white" />,
  youtube: <Youtube className="w-5 h-5 text-white" />,
  telegram: <MessageCircle className="w-5 h-5 text-white" />,
  whatsapp: <Phone className="w-5 h-5 text-white" />,
}

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

  const footerStyle = footer?.footerStyle || "style-1"

  const sharedProps = {
    brandName,
    description,
    copyright,
    activeSocialLinks,
    logo: footer?.logo,
    footerNavigation,
  }

  let FooterStyleComponent: any

  try {
    const importedModule = await import(`./styles/${footerStyle}`)
    FooterStyleComponent = importedModule.default
  } catch (error) {
    console.error(`Failed to load Footer style: ${footerStyle}, falling back to style-1`, error)
    const importedModule = await import(`./styles/style-1`)
    FooterStyleComponent = importedModule.default
  }

  return <FooterStyleComponent {...sharedProps} />
}

export default Footer

