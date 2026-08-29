"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BlockHeader from "@modules/common/components/block-header"
import { useTranslations } from "next-intl"

export default function Style4({
  title,
  badge,
  description,
  headerStyle,
  posts = [],
}: BlogBlockProps) {
  const t = useTranslations("Blog")

  return (
    <section className="py-12 bg-transparent text-ui-fg-base w-full">
      <div className="content-container">
        {(title || badge || description) && (
          <BlockHeader
            title={title}
            badge={badge}
            description={description}
            style={headerStyle || "style-1"}
            linkText={t("viewAll") || "View all"}
            linkHref="/blog"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-2xl border border-ui-border-base bg-ui-bg-subtle/50 hover:bg-ui-bg-subtle transition-all duration-200"
            >
              {post.category && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ui-bg-base border border-ui-border-base text-ui-fg-muted mb-3 inline-block">
                  {post.category}
                </span>
              )}
              <h3 className="text-lg font-bold text-ui-fg-base mb-2">
                <LocalizedClientLink href={`/blog/${post.id}`}>
                  {post.title}
                </LocalizedClientLink>
              </h3>
              {post.excerpt && (
                <p className="text-sm text-ui-fg-muted line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
              )}
              <div className="text-xs text-ui-fg-subtle flex items-center justify-between pt-4 border-t border-ui-border-base/50">
                <span>{post.author?.name || "Editorial"}</span>
                <span>{post.readTime || "5 min"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
