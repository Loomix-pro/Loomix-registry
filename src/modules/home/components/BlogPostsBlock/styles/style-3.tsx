"use client"

import React from "react"
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useTranslations } from "next-intl"
import BlockHeader from "@modules/common/components/block-header"
import { cn } from "@lib/utils"

export default function Style3({
  title,
  badge,
  description,
  headerStyle,
  posts = [],
}: BlogBlockProps) {
  const t = useTranslations("Blog")

  const formatDate = (dateStr: string) => {
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

  if (!posts || posts.length === 0) return null

  const [featuredPost, ...otherPosts] = posts
  const secondaryPosts = otherPosts.slice(0, 2)
  const remainingPosts = otherPosts.slice(2)

  return (
    <section className="w-full overflow-hidden py-4 sm:py-6">
      <div className="content-container">
        {hasHeader && (
          <BlockHeader
            title={title}
            badge={badge}
            description={description}
            linkText={t("viewAll")}
            linkHref="/blog"
            style={headerStyle || "style-1"}
          />
        )}

        {/* Bento / Editorial Showcase Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Main Large Featured Post (Hero Card) */}
          <article
            className={cn(
              "group relative rounded-[28px] overflow-hidden border border-border/70 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-end min-h-[420px] sm:min-h-[480px] lg:min-h-[540px]",
              secondaryPosts.length > 0 ? "lg:col-span-7" : "lg:col-span-12"
            )}
          >
            {/* Background Cover Image */}
            <div className="absolute inset-0 z-0">
              <Image
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              {/* Gradient Overlays for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
            </div>

            {/* Top Floating Badges */}
            <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between w-full">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-background/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{featuredPost.category}</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-[11px] font-medium">
                <Clock className="w-3.5 h-3.5 text-white/70" />
                <span>{featuredPost.readTime}</span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 p-6 sm:p-8 mt-auto space-y-4">
              <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(featuredPost.publishedAt)}</span>
              </div>

              <LocalizedClientLink
                href={`/blog/${featuredPost.id}`}
                className="block group/link"
              >
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug tracking-tight group-hover/link:text-primary transition-colors">
                  {featuredPost.title}
                </h3>
              </LocalizedClientLink>

              {featuredPost.excerpt && (
                <p className="text-white/80 text-sm sm:text-base line-clamp-2 leading-relaxed font-normal max-w-2xl">
                  {featuredPost.excerpt}
                </p>
              )}

              {/* Author & Read CTA */}
              <div className="pt-4 border-t border-white/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={featuredPost.author.avatar}
                    alt={featuredPost.author.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover border border-white/30"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">
                      {featuredPost.author.name}
                    </p>
                    <p className="text-[10px] text-white/60">
                      {t("journal_author")}
                    </p>
                  </div>
                </div>

                <LocalizedClientLink
                  href={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-xs font-bold transition-all duration-300 group/btn"
                >
                  <span>{t("readMore")}</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180 rtl:group-hover/btn:-translate-x-1 ltr:group-hover/btn:translate-x-1 transition-transform" />
                </LocalizedClientLink>
              </div>
            </div>
          </article>

          {/* Secondary Stacked Posts (Right 5 cols) */}
          {secondaryPosts.length > 0 && (
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              {secondaryPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex-1 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 p-5 bg-card/80 hover:bg-card backdrop-blur-xl rounded-[24px] border border-border/70 hover:border-primary/40 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <LocalizedClientLink
                    href={`/blog/${post.id}`}
                    className="relative aspect-[16/10] sm:aspect-square lg:aspect-[16/10] xl:aspect-square w-full sm:w-44 lg:w-full xl:w-44 shrink-0 rounded-2xl overflow-hidden block"
                  >
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-2.5 end-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                  </LocalizedClientLink>

                  {/* Body */}
                  <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>

                      <LocalizedClientLink
                        href={`/blog/${post.id}`}
                        className="block"
                      >
                        <h4 className="text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                      </LocalizedClientLink>

                      {post.excerpt && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={24}
                          height={24}
                          className="rounded-full object-cover border border-border"
                        />
                        <span className="text-xs font-semibold text-foreground">
                          {post.author.name}
                        </span>
                      </div>

                      <LocalizedClientLink
                        href={`/blog/${post.id}`}
                        aria-label={post.title}
                        className="w-8 h-8 rounded-full bg-muted/80 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors text-muted-foreground"
                      >
                        <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" />
                      </LocalizedClientLink>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Remaining Posts in Grid (if postCount > 3) */}
        {remainingPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {remainingPosts.map((post) => (
              <article
                key={post.id}
                className="group flex flex-col bg-card rounded-[22px] border border-border/70 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <LocalizedClientLink
                  href={`/blog/${post.id}`}
                  className="aspect-[16/10] overflow-hidden relative block"
                >
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 end-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {post.category}
                  </span>
                </LocalizedClientLink>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{formatDate(post.publishedAt)}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <LocalizedClientLink href={`/blog/${post.id}`}>
                      <h4 className="text-base font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                    </LocalizedClientLink>
                    {post.excerpt && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">
                      {post.author.name}
                    </span>
                    <LocalizedClientLink
                      href={`/blog/${post.id}`}
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      <span>{t("readMore")}</span>
                      <ArrowLeft className="w-3 h-3 rtl:rotate-0 ltr:rotate-180" />
                    </LocalizedClientLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
