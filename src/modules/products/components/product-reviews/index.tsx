"use client"

import {
  getProductReviews,
  toggleReviewReaction,
  getProductQuestions,
  submitQuestion,
} from "../../../../lib/data/products"
import { retrieveCustomer } from "../../../../lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import {
  StoreProductReview,
  StoreProductQuestion,
} from "../../../../types/global"
import { useState, useEffect, useCallback } from "react"
import ProductReviewsForm from "./form"
import { Star, Loader2, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { toJalali } from "@lib/util/date"
import StarRating from "@modules/common/components/star-rating"
import { Button } from "@modules/common/components/shadcn/button"

type SortOption =
  | "-created_at"
  | "created_at"
  | "-like_count"
  | "-dislike_count"
  | "-rating"
  | "rating"

interface Filters {
  is_verified_buyer?: boolean
  order: SortOption
}

function getInitials(name: string) {
  if (!name) return "U"
  const words = name.trim().split(" ")
  if (words.length >= 2) return words[0][0] + words[1][0]
  return name.slice(0, 2)
}

function SampleComment({
  review,
  onReaction,
}: {
  review: StoreProductReview
  onReaction: (
    reviewId: string,
    type: "like" | "dislike"
  ) => void | Promise<void>
}) {
  const t = useTranslations("Product.reviews")
  const [loading, setLoading] = useState<"like" | "dislike" | null>(null)
  const [expanded, setExpanded] = useState(false)
  const MAX_LENGTH = 120

  const handleReaction = (type: "like" | "dislike") => {
    setLoading(type)
    void onReaction(review.id, type)
    setTimeout(() => setLoading(null), 500)
  }

  const name =
    `${review.first_name || ""} ${review.last_name || ""}`.trim() ||
    t("user_placeholder")

  return (
    <div className="p-5 md:p-6 mb-4 rounded-3xl bg-background border border-border hover:border-border/80 transition-colors flex gap-4 shadow-sm">
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-border bg-muted text-foreground font-semibold text-base overflow-hidden">
          {getInitials(name)}
        </div>
        {review.is_verified_buyer && (
          <div
            className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5"
            title={t("verified_buyer")}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-foreground">{name}</p>
          {review.is_verified_buyer && (
            <span className="text-xs px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              {t("verified_buyer")}
            </span>
          )}
          <span className="text-xs text-muted-foreground mr-auto" dir="ltr">
            {toJalali(review.created_at)}
          </span>
        </div>

        {review.rating > 0 && (
          <div className="mt-1">
            <StarRating rating={review.rating} />
          </div>
        )}

        <div className="mt-3 space-y-2">
          {review.title && (
            <p className="font-semibold text-foreground">{review.title}</p>
          )}
          <p className="text-muted-foreground leading-relaxed text-sm">
            {review.content.length > MAX_LENGTH && !expanded ? (
              <>
                {review.content.slice(0, MAX_LENGTH)}...
                <button
                  className="text-primary hover:opacity-80 font-medium ml-1"
                  onClick={() => setExpanded(true)}
                >
                  {t("read_more")}
                </button>
              </>
            ) : (
              <>
                {review.content}
                {review.content.length > MAX_LENGTH && (
                  <button
                    className="text-primary hover:opacity-80 font-medium ml-1"
                    onClick={() => setExpanded(false)}
                  >
                    {t("close")}
                  </button>
                )}
              </>
            )}
          </p>
        </div>

        <div className="flex gap-3 items-center justify-end mt-2" dir="ltr">
          <button
            className={`flex items-center gap-1.5 h-9 px-3 rounded hover:bg-muted transition-colors ${
              review.user_reaction === "like"
                ? "text-emerald-600 bg-emerald-500/10"
                : "text-muted-foreground"
            }`}
            onClick={() => {
              handleReaction("like")
            }}
            disabled={loading === "like"}
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              {review.like_count > 0 && review.like_count}
            </span>
          </button>
          <button
            className={`flex items-center gap-1.5 h-9 px-3 rounded hover:bg-muted transition-colors ${
              review.user_reaction === "dislike"
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground"
            }`}
            onClick={() => {
              handleReaction("dislike")
            }}
            disabled={loading === "dislike"}
          >
            <ThumbsDown className="w-4 h-4" />
            <span className="text-sm font-medium">
              {review.dislike_count > 0 && review.dislike_count}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function FormQuestion({
  productId,
  onSuccess,
}: {
  productId: string
  onSuccess?: () => void
}) {
  const t = useTranslations("Product.reviews")
  const [form, setForm] = useState({ name: "", email: "", question: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)
    try {
      await submitQuestion({
        name: form.name,
        email: form.email,
        question_text: form.question,
        product_id: productId,
      })
      setForm({ name: "", email: "", question: "" })
      setMessage({ type: "success", text: t("question_success") })
      toast.success(t("question_success"))
      onSuccess?.()
    } catch {
      setMessage({ type: "error", text: t("question_error") })
      toast.error(t("question_error"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(e)
      }}
      className="flex flex-col gap-6 w-full max-w-2xl mx-auto text-start"
    >
      <hr className="border-border" />
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {t("ask_question_title")}
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="text-destructive">*</span>
          {t("required_fields")}
        </p>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1 text-sm text-muted-foreground">
          {t("question_text_label")}
          <span className="text-destructive">*</span>
        </label>
        <textarea
          placeholder={t("placeholder_question")}
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          required
          className="h-32 bg-background w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <label className="flex items-center gap-1 text-sm text-muted-foreground">
            {t("first_name")}
            <span className="text-destructive">*</span>
          </label>
          <input
            placeholder={t("placeholder_first_name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-background w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <label className="flex items-center gap-1 text-sm text-muted-foreground">
            {t("email")}
            <span className="text-destructive">*</span>
          </label>
          <input
            type="email"
            placeholder={t("placeholder_email")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-background w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full sm:w-56 sm:mr-auto"
      >
        {t("submit_question_btn")}
      </Button>
    </form>
  )
}

function QuestionItem({ question }: { question: StoreProductQuestion }) {
  const t = useTranslations("Product.reviews")
  const initials = question.name
    ? question.name.slice(0, 2)
    : t("user_placeholder").slice(0, 2)

  return (
    <div className="p-5 md:p-6 mb-4 flex gap-4 text-start rounded-3xl bg-background border border-border hover:border-border/80 transition-colors shadow-sm">
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-border bg-muted text-foreground font-semibold text-base">
          {initials}
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-foreground">{question.name}</p>
          <span className="text-xs text-muted-foreground mr-auto" dir="ltr">
            {toJalali(question.created_at)}
          </span>
        </div>
        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <span className="text-primary font-bold text-sm mt-0.5">
              {t("question_label")}
            </span>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {question.question_text}
            </p>
          </div>
          {question.answer_text && (
            <div className="flex gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <span className="text-emerald-600 dark:text-emerald-500 font-bold text-sm mt-0.5">
                {t("answer_label")}
              </span>
              <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed text-sm">
                {question.answer_text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProductReviews({ productId }: { productId: string }) {
  const t = useTranslations("Product.reviews")
  const defaultLimit = 10
  const [page, setPage] = useState(1)
  const [reviews, setReviews] = useState<StoreProductReview[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [hasMoreReviews, setHasMoreReviews] = useState(false)
  const [count, setCount] = useState(0)
  const [filters, setFilters] = useState<Filters>({ order: "-created_at" })

  const [questions, setQuestions] = useState<StoreProductQuestion[]>([])
  const [, setQuestionsCount] = useState(0)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [activeTab, setActiveTab] = useState<"review" | "question">("review")
  const [formMode, setFormMode] = useState<"review" | "question" | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingNext, setIsFetchingNext] = useState(false)
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)

  const fetchReviews = useCallback(
    (currentPage: number, currentFilters: Filters, append: boolean) => {
      if (currentPage === 1) setIsLoading(true)
      else setIsFetchingNext(true)

      getProductReviews({
        productId,
        limit: defaultLimit,
        offset: (currentPage - 1) * defaultLimit,
        is_verified_buyer: currentFilters.is_verified_buyer,
        order: currentFilters.order,
      })
        .then(({ reviews: fetched, average_rating, count, limit }) => {
          if (append) {
            setReviews((prev) => {
              const newReviews = fetched.filter(
                (review) => !prev.some((r) => r.id === review.id)
              )
              return [...prev, ...newReviews]
            })
          } else {
            setReviews(fetched)
          }
          setAvgRating(average_rating)
          setHasMoreReviews(count > limit * currentPage)
          setCount(count)
          setIsLoading(false)
          setIsFetchingNext(false)
        })
        .catch(() => {
          setIsLoading(false)
          setIsFetchingNext(false)
        })
    },
    [productId]
  )

  const fetchQuestions = useCallback(() => {
    setIsLoadingQuestions(true)
    getProductQuestions({ productId })
      .then(({ questions: fetched, count }) => {
        setQuestions(fetched)
        setQuestionsCount(count)
        setIsLoadingQuestions(false)
      })
      .catch(() => {
        setIsLoadingQuestions(false)
      })
  }, [productId])

  useEffect(() => {
    void retrieveCustomer().then((cust) => {
      setCustomer(cust)
    })
  }, [])

  useEffect(() => {
    setPage(1)
    fetchReviews(1, filters, false)
  }, [filters, fetchReviews])

  useEffect(() => {
    if (page > 1) {
      fetchReviews(page, filters, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (activeTab === "question") {
      fetchQuestions()
    }
  }, [activeTab, fetchQuestions])

  const handleReaction = async (reviewId: string, type: "like" | "dislike") => {
    if (!customer) {
      toast.error(t("login_required_reaction"))
      return
    }
    setReviews((prev) =>
      prev.map((review) => {
        if (review.id !== reviewId) return review
        const currentReaction = review.user_reaction
        let newReaction: "like" | "dislike" | null
        let likeDelta = 0,
          dislikeDelta = 0
        if (currentReaction === type) {
          newReaction = null
          if (type === "like") likeDelta = -1
          else dislikeDelta = -1
        } else {
          newReaction = type
          if (type === "like") {
            likeDelta = 1
            if (currentReaction === "dislike") dislikeDelta = -1
          } else {
            dislikeDelta = 1
            if (currentReaction === "like") likeDelta = -1
          }
        }
        return {
          ...review,
          user_reaction: newReaction,
          like_count: Math.max(0, review.like_count + likeDelta),
          dislike_count: Math.max(0, review.dislike_count + dislikeDelta),
        }
      })
    )
    try {
      const result = await toggleReviewReaction(reviewId, productId, type)
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                like_count: result.like_count,
                dislike_count: result.dislike_count,
                user_reaction: result.user_reaction,
              }
            : review
        )
      )
    } catch {
      fetchReviews(1, filters, false)
    }
  }

  return (
    <div className="product-page-constraint flex flex-col items-center w-full text-start my-16 px-4 md:px-0">
      {/* Elegant and premium header panel */}
      <div className="w-full bg-muted/30 border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shadow-sm backdrop-blur-md">
        <div className="space-y-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground dark:text-white leading-tight">
              {t("user_reviews")}
            </h2>
            <p className="mt-1.5 text-muted-foreground dark:text-zinc-400 text-sm leading-relaxed">
              {t("reviews_helper_text")}
            </p>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-2xl font-bold text-base leading-none">
              <Star className="w-4 h-4 fill-current" />
              <span>{avgRating ? avgRating.toFixed(1) : "0.0"}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <StarRating rating={avgRating} />
              <span className="text-xs text-muted-foreground font-semibold">
                {t("reviews_count_short", { count })}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Buttons with responsive scaling and micro-animations */}
        <div className="flex gap-3 flex-col sm:flex-row w-full md:w-auto">
          <button
            onClick={() => {
              if (!customer) {
                toast.error(t("login_required_review"))
                return
              }
              setFormMode(formMode === "review" ? null : "review")
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 border rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 active:scale-95 ${
              formMode === "review"
                ? "bg-muted text-foreground border-border"
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm hover:shadow"
            }`}
          >
            {t("submit_review_tab")}
          </button>
          <button
            onClick={() =>
              setFormMode(formMode === "question" ? null : "question")
            }
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 border rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 active:scale-95 ${
              formMode === "question"
                ? "bg-muted text-foreground border-border"
                : "bg-background text-foreground border-border hover:bg-muted shadow-sm hover:shadow"
            }`}
          >
            {t("ask_question_tab")}
          </button>
        </div>
      </div>

      <div
        className={`w-full overflow-hidden transition-[max-height] duration-700 ease-in-out ${
          formMode ? "max-h-[1000px] mb-10" : "max-h-0"
        }`}
      >
        {formMode === "review" && (
          <ProductReviewsForm
            productId={productId}
            onSuccess={() => setFormMode(null)}
          />
        )}
        {formMode === "question" && (
          <FormQuestion
            productId={productId}
            onSuccess={() => setFormMode(null)}
          />
        )}
      </div>

      <div className="w-full relative">
        {/* Switcher & Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5 mb-6">
          {/* Segmented Control */}
          <div className="flex p-1 bg-muted/50 rounded-2xl w-full lg:max-w-[260px] border border-border/40 dark:border-zinc-800/60">
            <button
              onClick={() => setActiveTab("review")}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "review"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("reviews_tab")}
            </button>
            <button
              onClick={() => setActiveTab("question")}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                activeTab === "question"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t("questions_tab")}
            </button>
          </div>

          {/* Filters & Sorting */}
          {activeTab === "review" && (
            <div className="flex items-center gap-3 justify-between lg:justify-end w-full lg:w-auto flex-nowrap">
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    is_verified_buyer: filters.is_verified_buyer
                      ? undefined
                      : true,
                  })
                }
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 active:scale-95 whitespace-nowrap ${
                  filters.is_verified_buyer
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm"
                    : "bg-muted/30 hover:bg-muted/50 text-foreground border-border hover:border-border/80"
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 transition-transform duration-300 ${
                    filters.is_verified_buyer
                      ? "scale-105 text-emerald-500"
                      : "scale-90 text-muted-foreground"
                  }`}
                />
                {t("verified_buyers_filter")}
              </button>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {t("sort_by")}
                </span>
                <div className="relative">
                  <select
                    className="appearance-none border border-border rounded-full pl-8 pr-4 py-1.5 text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer font-semibold text-muted-foreground min-w-[125px]"
                    value={filters.order}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        order: e.target.value as SortOption,
                      })
                    }
                  >
                    <option value="-created_at">{t("sort_newest")}</option>
                    <option value="created_at">{t("sort_oldest")}</option>
                    <option value="-rating">{t("sort_highest_rating")}</option>
                    <option value="rating">{t("sort_lowest_rating")}</option>
                    <option value="-like_count">{t("sort_most_liked")}</option>
                  </select>
                  {/* RTL Chevron Indicator */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-muted-foreground">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <hr className="mb-8 border-border dark:border-zinc-800" />

        {activeTab === "review" && (
          <div className="relative">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : reviews.length > 0 ? (
              <div className="flex flex-col">
                {reviews.map((c) => (
                  <SampleComment
                    key={c.id}
                    review={c}
                    onReaction={handleReaction}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border dark:border-zinc-800 rounded-3xl bg-muted/10">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-center font-semibold text-muted-foreground dark:text-zinc-350 text-sm mb-1">
                  {t("no_reviews_found")}
                </p>
                <p className="text-center text-xs text-muted-foreground leading-relaxed">
                  {t("reviews_helper_text")}
                </p>
              </div>
            )}

            {hasMoreReviews && (
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetchingNext}
                className="w-full mt-6 border border-border dark:border-zinc-800 text-muted-foreground dark:text-zinc-300 bg-background hover:bg-muted rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isFetchingNext ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("loading_more")}
                  </>
                ) : (
                  t("show_more")
                )}
              </button>
            )}
          </div>
        )}

        {activeTab === "question" && (
          <div className="relative">
            {isLoadingQuestions ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : questions.length > 0 ? (
              <div className="flex flex-col border border-border dark:border-zinc-800 rounded-3xl divide-y divide-border px-6 bg-background/30">
                {questions.map((q) => (
                  <QuestionItem key={q.id} question={q} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border dark:border-zinc-800 rounded-3xl bg-muted/10">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-center font-semibold text-muted-foreground dark:text-zinc-350 text-sm mb-1">
                  {t("no_questions_found")}
                </p>
                <p className="text-center text-xs text-muted-foreground leading-relaxed">
                  {t("reviews_helper_text")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
