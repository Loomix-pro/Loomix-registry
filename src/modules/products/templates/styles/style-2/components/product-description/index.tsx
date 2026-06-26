import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "next-intl"

interface ProductDescriptionProps {
  product: HttpTypes.StoreProduct
}

export default function ProductDescriptionStyle2({
  product,
}: ProductDescriptionProps) {
  const t = useTranslations("Product.description")
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
      <h3 className="font-bold text-gray-900 mb-2">{t("title")}</h3>
      <p className="text-gray-600 text-sm leading-7">{product.description}</p>
    </div>
  )
}
