import { Suspense } from "react"

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

const StoreStyle2 = async ({
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: Record<string, string | string[] | undefined>
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy ?? "created_at"
  const t = await getTranslations("Store")
  const settings = await getStorefrontSettings()

  const title = settings.storePage?.title ?? t("title")
  const description = settings.storePage?.description ?? t("description")

  const categories = await listCategories()
  const tags = await listTags()

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
      className="content-container py-6 pt-24 sm:pt-28 pb-32"
      data-testid="category-container"
    >
      {/* Modern, Premium Hero Section */}
      <div className="relative mb-16 rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-primary/85 text-primary-foreground shadow-2xl">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative z-10 px-8 py-20 text-center max-w-3xl mx-auto flex flex-col items-center justify-center">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 text-sm font-semibold tracking-wider uppercase text-primary-foreground/80 shadow-lg">
            {t("title")}
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-primary-foreground to-primary-foreground/70 drop-shadow-sm">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-medium leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Mobile Filter Trigger */}
        <Suspense fallback={null}>
          <MobileFilterSheet
            categories={categories}
            tags={tags}
            availableColors={availableColors}
            initialMinPrice={0}
            initialMaxPrice={500000000}
            tomanEnabled={isTomanEnabled()}
          />
        </Suspense>

        {/* Desktop Sidebar with Glassmorphism */}
        <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
          <div className="sticky top-24 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] transition-all duration-300">
            <Suspense fallback={null}>
              <FilterSidebar
                categories={categories}
                tags={tags}
                availableColors={availableColors}
                initialMinPrice={0}
                initialMaxPrice={500000000}
                tomanEnabled={isTomanEnabled()}
              />
            </Suspense>
          </div>
        </aside>

        {/* Product Listing Area */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreStyle2
