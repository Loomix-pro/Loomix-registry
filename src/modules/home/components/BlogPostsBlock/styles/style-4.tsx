"use client"

import React from "react"
import {
  Calendar,
  Clock,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  User,
} from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import BlockHeader from "@modules/common/components/block-header"

export default function Style4({
  title,
  badge,
  description,
  headerStyle,
  posts = [],
}: BlogBlockProps) {
  const t = useTranslations("Blog")

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ""
    try {
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(dateStr))
    } catch {
      return dateStr
    }
  }

  const hasHeader = Boolean(title || badge || description)
  const displayPosts = Array.isArray(posts) ? posts.slice(0, 6) : []

  return (
    <section className="bg-transparent text-ui-fg-base w-full overflow-hidden py-8 sm:py-12">
      <div className="content-container">
        {hasHeader && (
          <BlockHeader
            title={title}
            badge={badge}
            description={description}
            style={headerStyle || "style-1"}
            linkText={t("viewAll") || "View all stories"}
            linkHref="/blog"
          />
        )}

        {displayPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-ui-border-base rounded-3xl bg-ui-bg-subtle/30">
            <BookOpen className="w-10 h-10 text-ui-fg-muted/40 mb-3" />
            <p className="text-sm text-ui-fg-muted">
              {t("no_posts") || "No published articles available yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayPosts.map((post, idx) => {
              const coverUrl = post.coverImage
              const categoryName = post.category
              const authorName = post.author?.name
              const postDate = post.publishedAt
              const readingTime = post.readTime

              return (
                <article
                  key={post.id || idx}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-ui-border-base/60 bg-ui-bg-subtle/40 backdrop-blur-sm transition-all duration-300 hover:border-ui-border-strong hover:bg-ui-bg-subtle hover:shadow-xl hover:shadow-neutral-900/5 hover:-translate-y-1"
                >
                  {/* Top Image & Media Badge */}
                  <LocalizedClientLink
                    href={`/blog/${post.id}`}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-ui-bg-muted block"
                  >
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={post.title || "Blog post cover"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950 flex items-center justify-center p-6 text-center">
                        <Sparkles className="w-8 h-8 text-white/30" />
                      </div>
                    )}

                    {/* Gradient Overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    {/* Category Chip Floating on top */}
                    {categoryName && (
                      <div className="absolute top-4 start-4 z-10">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-medium tracking-wide text-white bg-black/50 backdrop-blur-md border border-white/20 rounded-full shadow-sm">
                          {categoryName}
                        </span>
                      </div>
                    )}

                    {/* Bottom Metadata inside Image */}
                    <div className="absolute bottom-3 start-4 end-4 z-10 flex items-center justify-between text-[11px] text-white/90 font-medium">
                      {postDate && (
                        <div className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-white/70" />
                          <span>{formatDate(postDate)}</span>
                        </div>
                      )}
                      {readingTime && (
                        <div className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-white/70" />
                          <span>
                            {readingTime} {t("min_read") || "min read"}
                          </span>
                        </div>
                      )}
                    </div>
                  </LocalizedClientLink>

                  {/* Body Content */}
                  <div className="flex flex-col flex-1 p-6 justify-between gap-4">
                    <div className="space-y-2.5">
                      <h3 className="text-lg sm:text-xl font-bold leading-snug text-ui-fg-base transition-colors duration-200 group-hover:text-ui-fg-interactive line-clamp-2">
                        <LocalizedClientLink href={`/blog/${post.id}`}>
                          {post.title}
                        </LocalizedClientLink>
                      </h3>

                      {post.excerpt && (
                        <p className="text-xs sm:text-sm text-ui-fg-muted line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Footer Row with Author & Action Button */}
                    <div className="pt-4 mt-auto border-t border-ui-border-base/40 flex items-center justify-between">
                      {authorName ? (
                        <div className="inline-flex items-center gap-2 text-xs text-ui-fg-subtle">
                          <div className="w-6 h-6 rounded-full bg-ui-bg-muted flex items-center justify-center text-ui-fg-muted border border-ui-border-base">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium text-ui-fg-muted truncate max-w-[120px]">
                            {authorName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-ui-fg-muted">
                          {t("editorial") || "Editorial"}
                        </span>
                      )}

                      <LocalizedClientLink
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ui-bg-base border border-ui-border-base text-ui-fg-muted transition-all duration-200 group-hover:bg-ui-fg-base group-hover:text-ui-bg-base group-hover:border-transparent group-hover:scale-110 shadow-sm"
                        aria-label={post.title}
                      >
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </LocalizedClientLink>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
