import { getTranslations } from "next-intl/server"
import React from "react"
import type { BlogPostsBlock as BlogPostsBlockType } from "@lib/data/homepage"
import { getBlogPosts } from "@lib/data/blog"
import BlockError from "../BlockRenderer/block-error"
import { getMediaUrl } from "@lib/util/strapi-media"

function mapStrapiPostToBlogPost(post: any): BlogPost {
  return {
    id: post.documentId || String(post.id),
    title: post.title || "",
    excerpt: post.excerpt || "",
    featured: !!post.featured,
    coverImage:
      getMediaUrl(post.coverImage) ||
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    locale: post.locale || "en",
    author: {
      name: post.author?.name || "Author",
      avatar:
        getMediaUrl(post.author?.avatar) ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    },
    publishedAt: post.publishedAt || post.createdAt || new Date().toISOString(),
    readTime: post.readTime || "5 min read",
    category: post.category?.slug || "general",
    blocks: (post.blocks || []).map((block: any) => {
      const type = block.__component
        ? block.__component.replace("blog.", "")
        : block.type
      let imageUrl = ""
      if (block.image) {
        imageUrl = getMediaUrl(block.image) || ""
      }
      return {
        ...block,
        type,
        imageUrl,
      }
    }),
  }
}

interface BlogPostsBlockProps {
  block: BlogPostsBlockType
}

export default async function BlogPostsBlock({ block }: BlogPostsBlockProps) {
  const t = await getTranslations("Blocks")

  const section = block.blog_section
  if (!section) return null

  const {
    title,
    badge,
    source,
    postCount = 3,
    style,
    headerStyle,
    posts: manualPosts = [],
  } = section
  let displayPosts = manualPosts.map(mapStrapiPostToBlogPost)

  if (source === "latest" || source === "views") {
    const allPosts = await getBlogPosts()

    if (source === "latest") {
      // Sort by date descending (getBlogPosts already does this, but let's be explicit)
      displayPosts = [...allPosts].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    } else if (source === "views") {
      // Sort by page views
      const storeBaseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
      const viewsRes = await fetch(`${storeBaseUrl}/api/views`, {
        next: { revalidate: 3600 },
      }).catch(() => null)

      let viewMap: Record<string, number> = {}
      if (viewsRes?.ok) {
        const data = await viewsRes.json()
        viewMap = data.views || {}
      }

      displayPosts = [...allPosts].sort((a, b) => {
        const viewsA = viewMap[a.id] || 0
        const viewsB = viewMap[b.id] || 0
        return viewsB - viewsA
      })
    }
  }

  // Slice to the requested post count
  displayPosts = displayPosts.slice(0, postCount)

  if (displayPosts.length === 0) return null

  const formattedStyle = style
    ? style.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
    : "style-1"

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`BlogPostsBlock: style "${formattedStyle}" not found.`, error)
    return (
      <BlockError
        error={error}
        formattedStyle={formattedStyle}
        blockName={t("blog_posts")}
      />
    )
  }

  if (!DynamicComponent) return null

  return (
    <DynamicComponent
      title={title}
      badge={badge}
      posts={displayPosts}
      headerStyle={headerStyle}
    />
  )
}
