/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
import React from "react"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useTranslations } from "next-intl"

export default function Style2({ title, subtitle, posts }: BlogBlockProps) {
  const t = useTranslations("Blog")
  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(dateStr))
    } catch (err) {
      return dateStr
    }
  }

  return (
    <section className="py-16 w-full overflow-hidden">
      <div className="content-container">
        {/* Header */}
        {(title || subtitle) && (
          <div
            className="text-center max-w-2xl mx-auto mb-12 space-y-3"
            dir="rtl"
          >
            {title && (
              <h2 className="text-3xl font-extrabold tracking-tight text-ui-fg-base">
                {title} استایل 2
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-ui-fg-subtle">{subtitle}</p>
            )}
          </div>
        )}

        {/* List of Rows */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto" dir="rtl">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group grid grid-cols-1 md:grid-cols-12 gap-6 p-5 bg-ui-bg-subtle rounded-2xl border border-ui-border-base hover:bg-ui-bg-base hover:shadow-md transition-all duration-300 ease-in-out"
            >
              {/* Cover Image */}
              <LocalizedClientLink
                href={`/blog/${post.id}`}
                className="md:col-span-4 aspect-[16/10] overflow-hidden rounded-xl relative block"
              >
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </LocalizedClientLink>

              {/* Card Body */}
              <div className="md:col-span-8 flex flex-col justify-between py-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-ui-fg-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <LocalizedClientLink
                    href={`/blog/${post.id}`}
                    className="block hover:text-indigo-600 transition-colors"
                  >
                    <h3 className="text-lg font-bold leading-snug text-ui-fg-base group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                  </LocalizedClientLink>
                  <p className="text-ui-fg-subtle text-[13px] line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-ui-border-base flex items-center justify-between mt-4 md:mt-0">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={28}
                      height={28}
                      className="rounded-full object-cover border border-ui-border-base"
                    />
                    <span className="text-xs font-semibold text-ui-fg-base">
                      {post.author.name}
                    </span>
                  </div>

                  <LocalizedClientLink
                    href={`/blog/${post.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                  >
                    <span>{t("readMore")}</span>
                    <ArrowLeft
                      size={14}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                  </LocalizedClientLink>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
