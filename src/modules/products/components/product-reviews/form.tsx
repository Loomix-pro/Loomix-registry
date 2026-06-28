"use client"

import { useState, useEffect } from "react"
import { retrieveCustomer } from "../../../../lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { toast } from "sonner"
import { addProductReview } from "../../../../lib/data/products"
import { Star, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

interface ProductReviewsFormProps {
  productId: string
  onSuccess?: () => void
}

function getDisplayName(customer: HttpTypes.StoreCustomer): {
  firstName: string
  lastName: string
} {
  if (customer.metadata?.username) {
    return { firstName: customer.metadata.username as string, lastName: "" }
  }
  const first =
    customer.first_name &&
    customer.first_name !== "null" &&
    customer.first_name !== "undefined"
      ? customer.first_name.trim()
      : ""
  const last =
    customer.last_name &&
    customer.last_name !== "null" &&
    customer.last_name !== "undefined"
      ? customer.last_name.trim()
      : ""
  return { firstName: first, lastName: last }
}

export default function ProductReviewsForm({
  productId,
  onSuccess,
}: ProductReviewsFormProps) {
  const t = useTranslations("Product.reviews")
  const [, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [rating, setRating] = useState(0)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)

  useEffect(() => {
    void retrieveCustomer().then((cust) => {
      setCustomer(cust)
      if (cust) {
        const { firstName: f, lastName: l } = getDisplayName(cust)
        setFirstName(f)
        setLastName(l)
        if (!f && !l) {
          setIsEditingName(true)
        }
      } else {
        setIsEditingName(true)
      }
    })
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!content || !rating || !firstName) {
      toast.error(t("fields_error"))
      return
    }

    setIsLoading(true)
    addProductReview({
      title,
      content,
      rating,
      first_name: firstName,
      last_name: lastName || "",
      product_id: productId,
    })
      .then(() => {
        setTitle("")
        setContent("")
        setRating(0)
        toast.success(t("review_success"))
        onSuccess?.()
      })
      .catch(() => {
        toast.error(t("review_error"))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full max-w-2xl mx-auto text-start"
    >
      <hr className="border-gray-200" />

      <h3 className="text-sm font-semibold text-gray-900">
        {t("submit_new_review")}
      </h3>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700">
          {t("rating")} <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 ${
                  i < rating
                    ? "fill-orange-400 text-orange-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700">{t("review_title")}</label>
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("placeholder_title")}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-700">
          {t("review_text")} <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("placeholder_content")}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 w-full h-32"
        />
      </div>

      {isEditingName ? (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="flex items-center gap-1 text-sm text-gray-700">
              {t("first_name")}
              <span className="text-red-500">*</span>
            </label>
            <input
              placeholder={t("placeholder_first_name")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="flex items-center gap-1 text-sm text-gray-700">
              {t("last_name")}
            </label>
            <input
              placeholder={t("placeholder_last_name")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mb-4 p-4 bg-gray-50 rounded border border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 leading-relaxed md:leading-normal">
              {t.rich("submit_notice", {
                name:
                  `${firstName} ${lastName}`.trim() || t("user_placeholder"),
                span: (chunks) => (
                  <span className="font-semibold text-gray-900 mx-1">
                    {chunks}
                  </span>
                ),
              })}
            </p>
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded transition-colors whitespace-nowrap"
            >
              {t("edit_name")}
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-40 mr-auto bg-black hover:bg-gray-800 text-white rounded px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          t("submit_btn")
        )}
      </button>
    </form>
  )
}
