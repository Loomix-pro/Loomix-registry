import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"
import React from "react"
import { HelpCircle, MessageSquare, RotateCcw } from "lucide-react"

const Help = () => {
  const t = useTranslations("Order")

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 p-6 sm:p-8 rounded-[32px] shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
      {/* Header section */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 bg-blue-50/70 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
          <HelpCircle size={18} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">
          {t("help")}
        </h3>
      </div>

      {/* Grid containing support cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact support */}
        <LocalizedClientLink
          href="/contact"
          className="group/help flex items-center gap-4 bg-gray-50/30 dark:bg-zinc-800/20 border border-gray-100/70 dark:border-zinc-800 p-4 rounded-2xl hover:border-blue-100 dark:hover:border-zinc-700 hover:shadow-xs transition-all duration-300"
        >
          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover/help:bg-blue-600 group-hover/help:text-white transition-colors duration-300 shrink-0">
            <MessageSquare size={18} />
          </div>
          <div className="flex flex-col text-left rtl:text-right min-w-0">
            <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 group-hover/help:text-blue-600 dark:group-hover/help:text-blue-400 transition-colors">
              {t("contact")}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5 truncate">
              {t("contact_support")}
            </span>
          </div>
        </LocalizedClientLink>

        {/* Returns and Exchanges */}
        <LocalizedClientLink
          href="/returns"
          className="group/help flex items-center gap-4 bg-gray-50/30 dark:bg-zinc-800/20 border border-gray-100/70 dark:border-zinc-800 p-4 rounded-2xl hover:border-blue-100 dark:hover:border-zinc-700 hover:shadow-xs transition-all duration-300"
        >
          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover/help:bg-blue-600 group-hover/help:text-white transition-colors duration-300 shrink-0">
            <RotateCcw size={18} />
          </div>
          <div className="flex flex-col text-left rtl:text-right min-w-0">
            <span className="text-sm font-semibold text-gray-800 dark:text-zinc-200 group-hover/help:text-blue-600 dark:group-hover/help:text-blue-400 transition-colors">
              {t("returns")}
            </span>
            <span className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5 truncate">
              {t("exchange_returns")}
            </span>
          </div>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Help
