"use client"

import { IconBadge, clx } from "@medusajs/ui"
import React, {
  SelectHTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { useTranslations } from "next-intl"

import ChevronDown from "@modules/common/icons/chevron-down"

type NativeSelectProps = {
  placeholder?: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">

const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ placeholder, className, children, ...props }, ref) => {
    const t = useTranslations("Cart")
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
        <IconBadge
          onFocus={() => innerRef.current?.focus()}
          onBlur={() => innerRef.current?.blur()}
          className={clx(
            "relative flex items-center txt-compact-small border text-ui-fg-base group bg-white dark:bg-zinc-800 dark:border-zinc-700",
            className,
            {
              "text-ui-fg-subtle": isPlaceholder,
            }
          )}
        >
          <select
            ref={innerRef}
            {...props}
            className="appearance-none bg-transparent border-none px-4 transition-colors duration-150 focus:border-gray-700 outline-none w-16 h-16 items-center justify-center text-inherit"
          >
            <option disabled value="" className="bg-white dark:bg-zinc-900">
              {activePlaceholder}
            </option>
            {React.Children.map(children, (child) => {
              if (
                React.isValidElement(child) &&
                (child as any).type === "option"
              ) {
                return React.cloneElement(child as any, {
                  className:
                    "bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100",
                })
              }
              return child
            })}
          </select>
          <span className="absolute flex pointer-events-none justify-end w-8 group-hover:animate-pulse">
            <ChevronDown />
          </span>
        </IconBadge>
      </div>
    )
  }
)

CartItemSelect.displayName = "CartItemSelect"

export default CartItemSelect
