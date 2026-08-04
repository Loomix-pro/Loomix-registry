import React, { Suspense } from "react"

import SkeletonProductGrid from "@/modules/common/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "../../paginated-products"
import { SortOptions } from "@modules/store/components/sort-bar"
import { FilterSidebar } from "@modules/store/components/filter-sidebar"
import { MobileFilterSheet } from "@modules/store/components/mobile-filter-sheet"
import { listCategories } from "@lib/data/categories"
import { listTags } from "@lib/data/tags"
import { getTranslations } from "next-intl/server"
import { isTomanEnabled } from "@lib/util/storefront-settings"
import { getStorefrontSettings } from "@lib/data/strapi-settings"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import { listActiveCampaigns } from "@lib/data/campaigns"

export interface StoreTemplateProps {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: Record<string, string | string[] | undefined>
  category?: HttpTypes.StoreProductCategory
  collection?: HttpTypes.StoreCollection
}

const StoreStyle1 = async ({
  sortBy,
  page,
  countryCode,
  searchParams,
  category,
  collection,
}: StoreTemplateProps) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy ?? "created_at"
  const tStore = await getTranslations("Store")
  const tNav = await getTranslations("Layout.nav")
  const settings = await getStorefrontSettings()

  let title = settings.storePage?.title ?? tStore("title")
  let description = settings.storePage?.description ?? tStore("description")

  if (category) {
    title = category.name
    description = category.description ?? ""
  } else if (collection) {
    title = collection.title
    description = ""
  }

  const parents = [] as HttpTypes.StoreProductCategory[]
  if (category) {
    const getParents = (cat: HttpTypes.StoreProductCategory) => {
      if (cat.parent_category) {
        parents.push(cat.parent_category)
        getParents(cat.parent_category)
      }
    }
    getParents(category)
  }

  const categories = category ? [] : await listCategories()
  const tags = await listTags()
  const activeCampaigns = await listActiveCampaigns()

  // Fetch product facets directly from Meilisearch
  const meilisearchHost =
    process.env.MEILISEARCH_HOST ??
    process.env.NEXT_PUBLIC_MEILISEARCH_HOST ??
    "http://localhost:7700"
  const meilisearchApiKey =
    process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY ??
    process.env.MEILISEARCH_API_KEY ??
    ""
  const indexName = process.env.NEXT_PUBLIC_MEILISEARCH_INDEX_NAME ?? "products"

  let response: { facets?: Record<string, Record<string, number>> } = {}
  try {
    const facetRes = await fetch(
      `${meilisearchHost}/indexes/${indexName}/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${meilisearchApiKey}`,
        },
        body: JSON.stringify({ q: "", limit: 0, facets: ["color_facets"] }),
        cache: "no-store",
      }
    )
    if (facetRes.ok) {
      const data = (await facetRes.json()) as {
        facetDistribution: Record<string, Record<string, number>>
      }
      response = { facets: data.facetDistribution }
    }
  } catch (e) {
    console.error("Failed to fetch facets from Meilisearch", e)
  }

  const availableColorsMap = new Map<string, { name: string; hex: string }>()
  const colorFacets = response.facets?.color_facets
  if (colorFacets) {
    for (const [facetString, count] of Object.entries(colorFacets)) {
      if (count > 0 && facetString.includes("::")) {
        const [colorName, hexCode] = facetString.split("::")
        const name = colorName.charAt(0).toUpperCase() + colorName.slice(1)
        const lowerName = name.toLowerCase()
        const isTrueHex = hexCode.startsWith("#")

        if (!availableColorsMap.has(lowerName) || isTrueHex) {
          availableColorsMap.set(lowerName, {
            name,
            hex: isTrueHex
              ? hexCode
              : availableColorsMap.get(lowerName)?.hex ??
                colorName.toLowerCase(),
          })
        }
      }
    }
  }

  const availableColors = Array.from(availableColorsMap.values())

  return (
    <div
      className="content-container py-6 pt-20 sm:pt-24 pb-24"
      data-testid="category-container"
    >
      {/* Breadcrumbs (for Category or Collection) */}
      {(category || collection) && (
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 mb-4 px-4 sm:px-0 overflow-x-auto no-scrollbar">
          <LocalizedClientLink
            className="hover:text-primary transition-colors whitespace-nowrap"
            href="/store"
          >
            {tNav("store")}
          </LocalizedClientLink>
          <span className="text-gray-300 dark:text-zinc-600">/</span>
          {category &&
            parents.reverse().map((parent) => (
              <React.Fragment key={parent.id}>
                <LocalizedClientLink
                  className="hover:text-primary transition-colors whitespace-nowrap"
                  href={`/categories/${parent.handle}`}
                >
                  {parent.name}
                </LocalizedClientLink>
                <span className="text-gray-300 dark:text-zinc-600">/</span>
              </React.Fragment>
            ))}
          <span className="font-semibold text-gray-900 dark:text-zinc-100 whitespace-nowrap">
            {category ? category.name : collection?.title}
          </span>
        </nav>
      )}

      {/* Page Header */}
      <div className="mb-10 px-4 sm:px-0 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-3">
          {title}
        </h1>
        {description && (
          <p className="text-base text-muted-foreground font-medium leading-relaxed">
            {description}
          </p>
        )}

        {/* Subcategories if Category */}
        {category?.category_children &&
          category.category_children.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {category.category_children.map((c) => (
                <LocalizedClientLink
                  key={c.id}
                  href={`/categories/${c.handle}`}
                >
                  <div className="px-3.5 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium text-gray-800 dark:text-zinc-200">
                    {c.name}
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Trigger */}
        <Suspense fallback={null}>
          <MobileFilterSheet
            categories={categories}
            tags={tags}
            availableColors={availableColors}
            activeCampaigns={activeCampaigns}
            initialMinPrice={0}
            initialMaxPrice={500000000}
            tomanEnabled={isTomanEnabled()}
          />
        </Suspense>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-[260px] flex-shrink-0">
          <Suspense fallback={null}>
            <FilterSidebar
              categories={categories}
              tags={tags}
              availableColors={availableColors}
              activeCampaigns={activeCampaigns}
              initialMinPrice={0}
              initialMaxPrice={500000000}
              tomanEnabled={isTomanEnabled()}
            />
          </Suspense>
        </aside>

        {/* Product Listing Area */}
        <div className="flex-1 min-w-0 px-4 sm:px-0">
          <Suspense
            key={`${pageNumber}-${sort}-${JSON.stringify(searchParams)}`}
            fallback={<SkeletonProductGrid />}
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category?.id}
              collectionId={collection?.id}
              countryCode={countryCode}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreStyle1
