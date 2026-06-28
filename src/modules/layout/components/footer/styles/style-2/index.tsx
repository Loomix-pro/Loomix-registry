"use client"

import React, { useState } from "react"
import { Send, ArrowRight, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { FOOTER_SECTIONS } from "../../constants"
import { Button } from "@modules/common/components/shadcn/button"
import { Input } from "@modules/common/components/shadcn/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FooterStyleComponentProps, SOCIAL_ICONS } from "../../index"
import { FooterLogo } from "../../logo"
import { useTranslations } from "next-intl"

const FooterStyle2: React.FC<FooterStyleComponentProps> = ({
  brandName,
  description,
  copyright,
  activeSocialLinks,
  logo,
  footerNavigation,
}) => {
  const t = useTranslations("Layout.footer")
  const [isLoading, setIsLoading] = useState(false)
  const shopLinks =
    footerNavigation && footerNavigation.length > 0
      ? footerNavigation.map((item) => ({
          label: item.title,
          href: item.path || "/",
        }))
      : FOOTER_SECTIONS.product.links.map((link) => ({
          label: t(link.label),
          href: link.href,
        }))
  return (
    <footer className="relative overflow-hidden bg-slate-50 dark:bg-[#07070a] border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-300 pt-20 pb-32 md:pb-20 px-6 md:px-12 transition-colors duration-500 z-10">
      {/* Dynamic Animated Background Blobs */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-1/4 left-10 w-[500px] h-[500px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] mix-blend-screen animate-pulse"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-1/4 right-10 w-[400px] h-[400px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] mix-blend-screen animate-pulse"
          style={{ animationDuration: "12s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Bento Cell 1: Brand Pitch & CTA (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-8 md:p-10 rounded-[2rem] bg-white dark:bg-slate-900/10 border border-slate-200/60 dark:border-slate-800/40 backdrop-blur-md transition-all duration-300 hover:shadow-lg dark:hover:shadow-indigo-950/10">
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="inline-block">
                  <FooterLogo logo={logo} textClassName="text-slate-900 dark:text-white text-3xl" />
                </div>
                {/* Modern Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 dark:border-emerald-500/10 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>{t("active_support")}</span>
                </div>
              </div>

              <p className="text-lg md:text-xl font-light text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900/60 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {t("discover_more") || "Elevate your everyday"}
              </span>
              <LocalizedClientLink
                href="/store"
                className="relative group overflow-hidden inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>{t("store")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300" />
              </LocalizedClientLink>
            </div>
          </div>

          {/* Bento Cell 2: Newsletter Box (col-span-5) */}
          <div className="lg:col-span-5 p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40 dark:from-indigo-950/10 dark:via-slate-900/10 dark:to-purple-950/10 border border-slate-200/60 dark:border-slate-800/40 backdrop-blur-md flex flex-col justify-between transition-all duration-300 hover:shadow-lg">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 block">
                {t("newsletter_tag") || "NEWSLETTER"}
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-3">
                {t("newsletter_title")}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {t("newsletter_desc")}
              </p>
            </div>

            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault()
                if (isLoading) return

                const form = e.target as HTMLFormElement
                const emailInput = form.elements.namedItem(
                  "email"
                ) as HTMLInputElement
                const email = emailInput.value

                if (!email) return

                setIsLoading(true)
                try {
                  const res = await fetch("/api/newsletter", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                  })

                  const data = await res.json()

                  if (res.ok) {
                    toast.success(
                      data.message
                        ? t(data.message as any)
                        : t("subscribe_success")
                    )
                    emailInput.value = ""
                  } else {
                    toast.error(
                      data.error ? t(data.error as any) : t("subscribe_error")
                    )
                  }
                } catch {
                  toast.error(t("server_error"))
                } finally {
                  setIsLoading(false)
                }
              }}
            >
              <div className="relative group">
                <Input
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                  placeholder={t("email_placeholder")}
                  className="w-full h-12 px-5 rounded-2xl bg-white/80 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all duration-300 disabled:opacity-50"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-indigo-500/25 hover:shadow-lg disabled:opacity-50 disabled:active:scale-100"
              >
                <span>{isLoading ? t("subscribing") : t("subscribe")}</span>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Second Row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-2">
          {/* Shop Column (col-span-4) */}
          <div className="lg:col-span-4 p-8 rounded-[2rem] bg-white dark:bg-slate-900/5 border border-slate-200/50 dark:border-slate-800/30 backdrop-blur-sm">
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-sm tracking-wider uppercase border-b border-slate-100 dark:border-slate-900/60 pb-3">
              {t(FOOTER_SECTIONS.product.title)}
            </h4>
            <ul className="space-y-3">
              {shopLinks.map((link, idx) => (
                <li key={idx}>
                  <LocalizedClientLink
                    href={link.href}
                    className="group flex items-center justify-between py-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                  >
                    <span className="group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 transition-transform duration-300 text-[15px] font-medium">
                      {link.label}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column (col-span-4) */}
          <div className="lg:col-span-4 p-8 rounded-[2rem] bg-white dark:bg-slate-900/5 border border-slate-200/50 dark:border-slate-800/30 backdrop-blur-sm">
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-sm tracking-wider uppercase border-b border-slate-100 dark:border-slate-900/60 pb-3">
              {t(FOOTER_SECTIONS.company.title)}
            </h4>
            <ul className="space-y-3">
              {FOOTER_SECTIONS.company.links.map((link, idx) => (
                <li key={idx}>
                  <LocalizedClientLink
                    href={link.href}
                    className="group flex items-center justify-between py-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                  >
                    <span className="group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 transition-transform duration-300 text-[15px] font-medium">
                      {t(link.label)}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300" />
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Bento Column (col-span-4) */}
          <div className="lg:col-span-4 p-8 rounded-[2rem] bg-white dark:bg-slate-900/5 border border-slate-200/50 dark:border-slate-800/30 backdrop-blur-sm flex flex-col justify-between">
            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-sm tracking-wider uppercase border-b border-slate-100 dark:border-slate-900/60 pb-3">
                {t("social_title")}
              </h4>

              {activeSocialLinks.length > 0 ? (
                <div className="grid grid-cols-4 gap-2.5">
                  {activeSocialLinks.map((social, idx) => {
                    const platform = social.platform
                    // Colors mapping for platform hover state
                    const hoverColors: Record<string, string> = {
                      twitter: "hover:bg-[#1da1f2] hover:border-[#1da1f2]",
                      github: "hover:bg-[#24292e] hover:border-[#24292e]",
                      linkedin: "hover:bg-[#0077b5] hover:border-[#0077b5]",
                      facebook: "hover:bg-[#1877f2] hover:border-[#1877f2]",
                      instagram:
                        "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:border-transparent",
                      youtube: "hover:bg-[#ff0000] hover:border-[#ff0000]",
                      telegram: "hover:bg-[#0088cc] hover:border-[#0088cc]",
                      whatsapp: "hover:bg-[#25d366] hover:border-[#25d366]",
                    }
                    const hoverColor =
                      hoverColors[platform] ||
                      "hover:bg-indigo-600 hover:border-indigo-600"
                    const iconNode = SOCIAL_ICONS[platform]
                    if (!iconNode) return null
                    return (
                      <a
                        key={idx}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-900 transition-all duration-300 group shadow-sm ${hoverColor}`}
                        title={platform}
                      >
                        <div className="text-slate-500 dark:text-slate-400 group-hover:text-white transition-colors duration-300">
                          {React.cloneElement(
                            iconNode as React.ReactElement<{
                              className?: string
                            }>,
                            {
                              className:
                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                            }
                          )}
                        </div>
                      </a>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                  No social links configured.
                </p>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-900/60 text-xs text-slate-400 dark:text-slate-500 font-medium">
              {t("social_follow_desc")}
            </div>
          </div>
        </div>

        {/* Colossal Brand Name Watermark */}
        <div className="relative select-none pointer-events-none my-1 overflow-hidden w-full flex justify-center items-center h-[6vw] min-h-[40px] max-h-[80px]">
          <span className="text-[6vw] font-black uppercase tracking-widest text-slate-900/[0.03] dark:text-white/[0.03] leading-none whitespace-nowrap block select-none">
            {brandName}
          </span>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-900/80 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] text-slate-500 dark:text-slate-500 font-medium">
          <p>
            © {new Date().getFullYear()} {brandName}. {copyright}
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            {FOOTER_SECTIONS.legal.links.map((link, idx) => (
              <LocalizedClientLink
                key={idx}
                href={link.href}
                className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
              >
                {t(link.label)}
              </LocalizedClientLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterStyle2
