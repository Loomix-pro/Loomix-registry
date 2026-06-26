"use client"

import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "next-intl"
import { useProductActions } from "@lib/hooks/use-product-actions"
import { Loader2, Plus, Minus } from "lucide-react"
import ProductPrice from "@modules/products/components/product-price"
import { Button } from "@modules/common/components/shadcn/button"
import { cn } from "@lib/utils"
import WishlistButton from "@modules/products/components/wishlist-button"
import { useDictionary } from "@modules/common/components/dictionary-provider"

interface ProductActionsV2Props {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

export default function ProductActionsV2({
  product,
  disabled,
}: ProductActionsV2Props) {
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
  const t = useTranslations("Product.actions")
  const translate = useDictionary()

  return (
    <div className="flex flex-col gap-6">
      {/* Color Selection (Swatches Style) */}
      {colorOption && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ui-fg-muted">
            {translate(colorOption.title)}:{" "}
            <span className="text-ui-fg-base">
              {translate(options[colorOption.id]) || t("select_color")}
            </span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {colorOption.values?.map((v) => {
              const colorValue = v.value.toLowerCase()
              const colorHex = colorCodeMap.get(colorValue) ?? colorValue

              return (
                <button
                  key={v.id}
                  onClick={() => handleColorChange(v.value || "")}
                  className={cn(
                    "w-6 h-6 rounded-full border border-ui-border-base transition-all p-0.5",
                    options[colorOption.id] === v.value
                      ? "ring-2 ring-ui-border-strong ring-offset-2 scale-110 shadow-sm"
                      : "hover:scale-110"
                  )}
                  disabled={(disabled ?? false) || isAdding}
                  title={translate(v.value) || ""}
                >
                  <div
                    className="w-full h-full rounded-full"
                    style={{ backgroundColor: colorHex }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size Selection & Quantity */}
      <div className="grid grid-cols-2 gap-4">
        {/* Size Selection */}
        {sizeOption && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ui-fg-muted">
              {translate(sizeOption.title || t("size"))}
            </p>
            <div className="flex flex-wrap gap-2">
              {sizeOption.values?.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setOptionValue(sizeOption.id, v.value)}
                  disabled={(disabled ?? false) || isAdding}
                  className={cn(
                    "h-10 min-w-10 px-3 flex items-center justify-center rounded-md border text-xs font-medium transition-all",
                    options[sizeOption.id] === v.value
                      ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-bold"
                      : "border-ui-border-base bg-ui-bg-base text-ui-fg-base hover:border-ui-border-interactive hover:bg-ui-bg-subtle",
                    ((disabled ?? false) || isAdding) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  {translate(v.value)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ui-fg-muted">
            {t("quantity")}
          </p>
          <div className="flex items-center border border-ui-border-base rounded-md h-10 bg-ui-bg-base overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 h-full hover:bg-ui-bg-subtle transition-colors disabled:opacity-30"
              disabled={quantity <= 1 || (disabled ?? false) || isAdding}
            >
              <Minus size={14} />
            </button>
            <span className="flex-1 text-center text-xs font-bold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
              className="px-3 h-full hover:bg-ui-bg-subtle transition-colors disabled:opacity-30"
              disabled={quantity >= maxStock || (disabled ?? false) || isAdding}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="pt-2">
        <ProductPrice product={product} variant={selectedVariant} />
        {selectedVariant && !inStock && (
          <p className="text-[10px] text-red-500 mt-1 font-bold">
            {t("out_of_stock")}
          </p>
        )}
      </div>

      {/* Add To Cart + Wishlist */}
      <div className="flex gap-3">
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
          className="flex-1 h-11 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all font-bold text-sm rounded-xl uppercase tracking-widest"
          data-testid="add-product-button"
        >
          {isAdding ? (
            <Loader2 className="animate-spin mr-2" size={16} />
          ) : null}
          {!selectedVariant && (sizeOption || colorOption)
            ? t("select_options")
            : !inStock || !isValidVariant
            ? t("out_of_stock")
            : t("add_to_bag")}
        </Button>
        <WishlistButton variantId={selectedVariant?.id} />
      </div>
    </div>
  )
}
