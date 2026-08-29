"use client"

import React from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslations } from "next-intl"

export default function Style5({ title, posts = [] }: BlogBlockProps) {
  const t = useTranslations("Blog")

  return (
    <section className="py-10 bg-transparent w-full">
      <div className="content-container">
        {title && (
          <h2 className="text-2xl font-bold text-ui-fg-base mb-6">{title}</h2>
        )}
        <ul className="divide-y divide-ui-border-base">
          {posts.map((post) => (
            <li key={post.id} className="py-4 flex items-center justify-between gap-4">
              <div>
                <LocalizedClientLink
                  href={`/blog/${post.id}`}
                  className="font-semibold text-ui-fg-base hover:text-ui-fg-interactive transition-colors"
                >
                  {post.title}
                </LocalizedClientLink>
                {post.category && (
                  <span className="ms-2 text-xs text-ui-fg-muted">
                    — {post.category}
                  </span>
                )}
              </div>
              <span className="text-xs text-ui-fg-subtle whitespace-nowrap">
                {post.readTime || "5 min"}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <LocalizedClientLink
            href="/blog"
            className="text-sm font-medium text-ui-fg-interactive hover:underline"
          >
            {t("viewAll") || "View all →"}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
