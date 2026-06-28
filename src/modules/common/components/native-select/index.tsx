"use client"

import { ChevronUpDown } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { useTranslations } from "next-intl"

export type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & SelectHTMLAttributes<HTMLSelectElement>

const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder, defaultValue, className, children, ...props }, ref) => {
    const t = useTranslations("Common")
    const activePlaceholder = placeholder || t("select_placeholder")
    const innerRef = useRef<HTMLSelectElement>(null)
    const [isPlaceholder, setIsPlaceholder] = useState(false)

    useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
      ref,
      () => innerRef.current
    )

    useEffect(() => {
      if (innerRef.current && innerRef.current.value === "") {
        setIsPlaceholder(true)
      } else {
        setIsPlaceholder(false)
      }
    }, [innerRef.current?.value])

    return (
      <div>
        <div
          onFocus={() => innerRef.current?.focus()}
          onBlur={() => innerRef.current?.blur()}
          className={clx(
            "relative flex items-center text-sm font-normal border border-ui-border-base dark:border-zinc-800 bg-ui-bg-subtle dark:bg-zinc-800/50 rounded-xl hover:bg-ui-bg-field-hover dark:hover:bg-zinc-800 transition-all",
            className,
            {
              "text-ui-fg-muted dark:text-zinc-500": isPlaceholder,
              "text-gray-900 dark:text-zinc-100": !isPlaceholder,
            }
          )}
        >
          <select
            ref={innerRef}
            defaultValue={defaultValue}
            {...props}
            className="appearance-none flex-1 bg-transparent border-none px-4 py-2.5 transition-colors duration-150 outline-none text-sm font-normal"
          >
            <option disabled value="">
              {activePlaceholder}
            </option>
            {children}
          </select>
          <span className="absolute ltr:right-4 rtl:left-4 inset-y-0 flex items-center pointer-events-none ">
            <ChevronUpDown />
          </span>
        </div>
      </div>
    )
  }
)

NativeSelect.displayName = "NativeSelect"

export default NativeSelect
