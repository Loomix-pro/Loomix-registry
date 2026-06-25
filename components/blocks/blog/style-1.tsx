/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
import React from "react"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useTranslations } from "next-intl"

export default function Style1({ title, subtitle, posts }: BlogBlockProps) {
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
    <section className="py-16 bg-[#030712] text-gray-100 w-full overflow-hidden">
      <div className="content-container">
        {/* Header */}
        {(title || subtitle) && (
          <div
            className="text-center max-w-2xl mx-auto mb-12 space-y-3"
            dir="rtl"
          >
            {title && (
              <h2 className="text-3xl font-extrabold tracking-tight text-white bg-gradient-to-l from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                {title} استایل 1
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 font-light">{subtitle}</p>
            )}
          </div>
        )}

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          dir="rtl"
        >
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col bg-[#0a0f1a] rounded-2xl border border-[#1a2138] overflow-hidden hover:border-indigo-500/40 hover:shadow-[0_8px_30px_-10px_rgba(79,70,229,0.25)] transition-all duration-300 ease-out"
            >
              {/* Cover Image */}
              <LocalizedClientLink
                href={`/blog/${post.id}`}
                className="aspect-[16/10] overflow-hidden relative block"
              >
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 bg-indigo-600/95 backdrop-blur-sm text-white font-semibold text-[10px] px-2.5 py-1 rounded-full border border-indigo-400/20 shadow-md uppercase tracking-wider">
                  {post.category}
                </span>
              </LocalizedClientLink>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <LocalizedClientLink
                    href={`/blog/${post.id}`}
                    className="block hover:text-indigo-400 transition-colors"
                  >
                    <h3 className="text-lg font-bold leading-snug line-clamp-2 text-gray-100 group-hover:text-white transition-colors">
                      {post.title}
                    </h3>
                  </LocalizedClientLink>
                  <p className="text-gray-400 text-[13px] line-clamp-3 leading-relaxed font-light">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-[#1a2138] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover border border-[#1a2138]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-gray-200">
                        {post.author.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
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
                  </div>

                  <LocalizedClientLink
                    href={`/blog/${post.id}`}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
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
