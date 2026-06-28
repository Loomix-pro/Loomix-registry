"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { NavItem } from "./types"
import { cn } from "@lib/utils"

export const DesktopNavigationItem = ({
  item,
  t,
}: {
  item: NavItem
  t: any
}) => {
  if (!item.items || item.items.length === 0) {
    return (
      <LocalizedClientLink
        href={item.href}
        className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors px-3 py-2 flex items-center whitespace-nowrap"
      >
        {item.title || t(item.id)}
      </LocalizedClientLink>
    )
  }

  return (
    <div className="relative group">
      <LocalizedClientLink
        href={item.href}
        className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors px-3 py-2 flex items-center whitespace-nowrap cursor-pointer gap-1"
      >
        {item.title || t(item.id)}
        <ChevronDown
          size={14}
          className="opacity-50 transition-transform group-hover:-rotate-180 duration-300"
        />
      </LocalizedClientLink>

      {/* First level dropdown directly below */}
      <div className="absolute top-full ltr:left-0 rtl:right-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2 min-w-[220px] z-50">
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 flex flex-col gap-1">
          {item.items.map((subItem) => (
            <DesktopSubNavigationItem key={subItem.id} item={subItem} t={t} />
          ))}
        </div>
      </div>
    </div>
  )
}

const DesktopSubNavigationItem = ({ item, t }: { item: NavItem; t: any }) => {
  if (!item.items || item.items.length === 0) {
    return (
      <LocalizedClientLink
        href={item.href}
        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors px-4 py-2.5 whitespace-nowrap"
      >
        {item.title || t(item.id)}
      </LocalizedClientLink>
    )
  }

  // Infinite depth submenu opens to the side
  return (
    <div className="relative group/sub">
      <LocalizedClientLink
        href={item.href}
        className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl transition-colors px-4 py-2.5 flex items-center justify-between whitespace-nowrap cursor-pointer"
      >
        {item.title || t(item.id)}
        <ChevronDown
          size={14}
          className="opacity-50 rtl:rotate-90 ltr:-rotate-90"
        />
      </LocalizedClientLink>

      <div className="absolute top-0 ltr:left-full rtl:right-full opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 ltr:pl-2 rtl:pr-2 min-w-[220px] z-50">
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-2 flex flex-col gap-1">
          {item.items.map((subItem) => (
            <DesktopSubNavigationItem key={subItem.id} item={subItem} t={t} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const MobileNavigationItem = ({
  item,
  t,
  setIsMenuOpen,
  depth = 0,
  isRtl = false,
}: {
  item: NavItem
  t: any
  setIsMenuOpen: any
  depth?: number
  isRtl?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // For items without submenus
  if (!item.items || item.items.length === 0) {
    return (
      <LocalizedClientLink
        href={item.href}
        className="flex items-center text-sm py-3 px-4 mb-1 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
        style={{
          marginLeft:
            depth === 0 ? undefined : isRtl ? undefined : `${depth * 0.75}rem`,
          marginRight:
            depth === 0 ? undefined : isRtl ? `${depth * 0.75}rem` : undefined,
        }}
        onClick={() => setIsMenuOpen(false)}
      >
        {item.title || t(item.id)}
      </LocalizedClientLink>
    )
  }

  // For items WITH submenus (Split Button Design)
  return (
    <div className="flex flex-col mb-1.5">
      <div
        className={cn(
          "flex items-stretch justify-between text-sm rounded-xl overflow-hidden transition-all border",
          isOpen
            ? "bg-gray-100 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 shadow-sm"
            : "bg-gray-50 dark:bg-gray-900/50 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
        )}
        style={{
          marginLeft:
            depth === 0 ? undefined : isRtl ? undefined : `${depth * 0.75}rem`,
          marginRight:
            depth === 0 ? undefined : isRtl ? `${depth * 0.75}rem` : undefined,
        }}
      >
        {/* 1. The Link Area */}
        <LocalizedClientLink
          href={item.href}
          onClick={() => setIsMenuOpen(false)}
          className="flex-1 py-3 px-4 font-medium text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white flex items-center"
        >
          {item.title || t(item.id)}
        </LocalizedClientLink>

        {/* 2. The Toggle Submenu Area */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className={cn(
            "w-14 flex items-center justify-center transition-colors",
            isRtl ? "border-r" : "border-l",
            isOpen
              ? "border-gray-200 dark:border-gray-700 bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700"
              : "border-gray-200 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-800"
          )}
          aria-label="Toggle submenu"
        >
          <ChevronDown
            size={18}
            className={cn(
              "transition-transform duration-300 opacity-70",
              isOpen ? "rotate-180" : ""
            )}
          />
        </button>
      </div>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-1.5"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden flex flex-col gap-0">
          {/* Add a little visual cue for nested items (a vertical line) */}
          <div
            className={cn(
              "flex flex-col gap-0.5 relative pt-1",
              isRtl ? "pr-1" : "pl-1"
            )}
          >
            <div
              className={cn(
                "absolute top-2 bottom-2 w-[2px] bg-gray-100 dark:bg-gray-800 rounded-full",
                isRtl ? "right-2" : "left-2"
              )}
            />
            {item.items.map((subItem) => (
              <MobileNavigationItem
                key={subItem.id}
                item={subItem}
                t={t}
                setIsMenuOpen={setIsMenuOpen}
                depth={depth + 1}
                isRtl={isRtl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
