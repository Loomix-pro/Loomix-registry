/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
"use client"

import { clx } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import { Layout, User, MapPin, ShoppingBag, Heart, LogOut } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { useTranslations } from "next-intl"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const t = useTranslations("Account.Nav")

  const handleLogout = async () => {
    await signout(countryCode)
  }

  return (
    <div>
      <div
        className="md:hidden fixed bottom-6 left-6 right-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/5 px-6 py-4 z-50 flex justify-around items-center rounded-3xl shadow-2xl shadow-blue-900/10 dark:shadow-blue-950/20"
        data-testid="mobile-account-nav"
      >
        <AccountNavLinkMobile
          href="/account"
          route={route!}
          label={t("overview")}
          icon={Layout}
        />
        <AccountNavLinkMobile
          href="/account/profile"
          route={route!}
          label={t("profile")}
          icon={User}
        />
        <AccountNavLinkMobile
          href="/account/addresses"
          route={route!}
          label={t("addresses")}
          icon={MapPin}
        />
        <AccountNavLinkMobile
          href="/account/orders"
          route={route!}
          label={t("orders")}
          icon={ShoppingBag}
        />
        <AccountNavLinkMobile
          href="/account/wishlist"
          route={route!}
          label={t("wishlist")}
          icon={Heart}
        />
      </div>

      <aside
        className="hidden md:block w-64 space-y-6"
        data-testid="account-nav"
      >
        <div>
          <p className="px-4 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4">
            {t("main_menu")}
          </p>
          <div className="space-y-1.5">
            <AccountNavLinkDesktop
              href="/account"
              route={route!}
              label={t("overview")}
              icon={Layout}
            />
            <AccountNavLinkDesktop
              href="/account/profile"
              route={route!}
              label={t("profile")}
              icon={User}
            />
            <AccountNavLinkDesktop
              href="/account/addresses"
              route={route!}
              label={t("addresses")}
              icon={MapPin}
            />
            <AccountNavLinkDesktop
              href="/account/orders"
              route={route!}
              label={t("orders")}
              icon={ShoppingBag}
            />
            <AccountNavLinkDesktop
              href="/account/wishlist"
              route={route!}
              label={t("wishlist")}
              icon={Heart}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 italic">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 text-[10px] rounded-2xl font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-all group"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <div className="group-hover:scale-110 transition-transform">
              <LogOut size={16} />
            </div>
            {t("sign_out")}
          </button>
        </div>
      </aside>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  label: string
  icon: React.ElementType
}

const AccountNavLinkDesktop = ({
  href,
  route,
  label,
  icon: Icon,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()
  const active =
    route.endsWith(href) ||
    (href === "/account" && route === `/${countryCode}/account`)

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-2xl transition-all duration-300 border",
        {
          "bg-white dark:bg-zinc-800 text-blue-600 shadow-lg shadow-blue-500/5 dark:shadow-blue-950/20 border-blue-50 dark:border-blue-950":
            active,
          "text-gray-500 dark:text-zinc-400 border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100":
            !active,
        }
      )}
    >
      <div
        className={clx("transition-colors duration-300", {
          "text-blue-500": active,
          "text-gray-400 dark:text-zinc-500": !active,
        })}
      >
        <Icon size={18} />
      </div>
      <span className="tracking-wide">{label}</span>
      {active && (
        <div className="ms-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all"></div>
      )}
    </LocalizedClientLink>
  )
}

const AccountNavLinkMobile = ({
  href,
  route,
  label,
  icon: Icon,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()
  const active =
    route.endsWith(href) ||
    (href === "/account" && route === `/${countryCode}/account`)

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "flex flex-col items-center gap-1.5 flex-1 py-1 transition-all",
        {
          "text-blue-600": active,
          "text-gray-400 dark:text-zinc-500": !active,
        }
      )}
    >
      <div
        className={clx("transition-all duration-500", {
          "scale-110 -translate-y-1": active,
          "scale-100": !active,
        })}
      >
        <Icon size={22} />
      </div>
      <span
        className={clx(
          "text-[8px] font-bold tracking-[0.15em] uppercase transition-all duration-500",
          {
            "opacity-100": active,
            "opacity-40": !active,
          }
        )}
      >
        {label}
      </span>
      {active && (
        <div className="w-1 h-1 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
      )}
    </LocalizedClientLink>
  )
}

export default AccountNav
