"use client"

import { Loader2, Plus, Minus } from "lucide-react"
import { useProductActions } from "@lib/hooks/use-product-actions"
import { HttpTypes } from "@medusajs/types"
import { cn } from "@lib/utils"
import { useTranslations } from "next-intl"
import { Button } from "@modules/common/components/shadcn/button"
import WishlistButton from "../../wishlist-button"
import { useDictionary } from "@modules/common/components/dictionary-provider"

interface ProductActionsStyle2Props {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

export default function ProductActionsStyle2({
  product,
  disabled,
}: ProductActionsStyle2Props) {
  const t = useTranslations("Product.actions")
  const translate = useDictionary()
  const {
    options,
    isAdding,
    quantity,
    setQuantity,
    colorCodeMap,
    colorOption,
    sizeOption,
    selectedVariant,
    handleColorChange,
    isValidVariant,
    inStock,
    maxStock,
    handleAddToCart,
    setOptionValue,
  } = useProductActions({ product, disabled })

  return (
    <div className="flex flex-col gap-6">
      {/* Colors */}
      {colorOption && (
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-gray-800">
            {translate(colorOption.title || t("color"))}:{" "}
            <span className="font-normal text-gray-500">
              {translate(options[colorOption.id])}
            </span>
          </h4>
          <div className="flex gap-2">
            {colorOption.values?.map((v) => {
              const colorValue = v.value.toLowerCase()
              const colorHex = colorCodeMap.get(colorValue) ?? colorValue
              return (
                <button
                  key={v.id}
                  onClick={() => handleColorChange(v.value || "")}
                  className={cn(
                    "w-8 h-8 rounded border flex items-center justify-center p-0.5",
                    options[colorOption.id] === v.value
                      ? "ring-2 ring-red-500 ring-offset-2"
                      : ""
                  )}
                  title={translate(v.value) || ""}
                >
                  <div
                    className="w-full h-full rounded shadow-inner"
                    style={{ backgroundColor: colorHex }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizeOption && (
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-gray-800">
            {translate(sizeOption.title || t("size"))}
          </h4>
          <div className="flex gap-2 flex-wrap">
            {sizeOption.values?.map((v) => (
              <button
                key={v.id}
                onClick={() => setOptionValue(sizeOption.id, v.value || "")}
                className={cn(
                  "px-4 py-2 border rounded text-sm font-bold transition-all",
                  options[sizeOption.id] === v.value
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                )}
              >
                {translate(v.value)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity and Add to Cart */}
      <div className="flex gap-4 items-end pt-6">
        <div className="w-1/3">
          <label className="text-xs font-bold text-gray-500 mb-2 block">
            {t("quantity")}
          </label>
          <div className="flex items-center border border-ui-border-base rounded-md h-[52px] bg-ui-bg-base overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 h-full hover:bg-ui-bg-subtle transition-colors disabled:opacity-30 flex items-center justify-center w-10"
              disabled={quantity <= 1 || (disabled ?? false) || isAdding}
            >
              <Minus size={16} />
            </button>
            <span className="flex-1 text-center text-sm font-bold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
              className="px-3 h-full hover:bg-ui-bg-subtle transition-colors disabled:opacity-30 flex items-center justify-center w-10"
              disabled={quantity >= maxStock || (disabled ?? false) || isAdding}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <Button
          onClick={() => {
            void handleAddToCart()
          }}
          disabled={
            !inStock ||
            !selectedVariant ||
            (disabled ?? false) ||
            isAdding ||
            !isValidVariant
          }
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold text-lg transition-all shadow-lg h-[52px]"
          data-testid="add-product-button"
        >
          {isAdding ? (
            <Loader2 className="animate-spin mr-2" size={20} />
          ) : null}
          {!inStock ? t("out_of_stock") : t("add_to_cart")}
        </Button>
        <WishlistButton
          variantId={selectedVariant?.id}
          className="h-[52px] w-[52px] rounded-lg"
        />
      </div>
      {!inStock && selectedVariant && (
        <p className="text-xs text-red-500 font-medium">
          {t("variant_out_of_stock")}
        </p>
      )}
    </div>
  )
}
