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

/**
 * Guide for creating a new Store/Category Template style
 * 
 * This component acts as the main layout structure for the Store or Category listing page.
 * If you intend to create a new style (e.g., style-3), you must consider the following:
 * 
 * 1. Received Data (Props):
 *    - `sortBy`: The current sorting option (e.g., "created_at", "price_asc").
 *    - `page`: The current page number for pagination.
 *    - `countryCode`: The region's country code, used for fetching correct pricing.
 *    - `searchParams`: The URL search parameters containing active filters (categories, tags, etc.).
 * 
 * 2. Server-side Data Fetching:
 *    - This is a Server Component. It fetches data before rendering:
 *      - Store settings (title, description) from `getStorefrontSettings()`.
 *      - Available `categories` and `tags` for the sidebar filter.
 *      - Facets from Meilisearch to display available colors/options for filtering.
 * 
 * 3. Component Structure:
 *    - Sidebar/Filters: Typically rendered as a sticky sidebar (`FilterSidebar`) on desktop, 
 *      and a slide-out sheet (`MobileFilterSheet`) on mobile. 
 *    - Product Grid: Renders `PaginatedProducts` inside a `Suspense` boundary to show a 
 *      loading skeleton (`SkeletonProductGrid`) while products are fetched.
 * 
 * 4. Customizing the Filters and Grid:
 *    You can modify how filters are displayed or how the grid is structured by wrapping 
 *    the inner components differently, or copying them to your new style's `components` folder.
 */
const StoreStyle1 = async ({
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

  // Fetch product facets directly from Meilisearch (no cache) to always show the latest colors
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

  // Extract unique colors from the custom Meilisearch 'color_facets' mapped field
  // The format in MS is "ColorName::#HexCode"
  const availableColorsMap = new Map<string, { name: string; hex: string }>()

  const colorFacets = response.facets?.color_facets
  if (colorFacets) {
    for (const [facetString, count] of Object.entries(colorFacets)) {
      if (count > 0 && facetString.includes("::")) {
        const [colorName, hexCode] = facetString.split("::")
        const name = colorName.charAt(0).toUpperCase() + colorName.slice(1)
        const lowerName = name.toLowerCase()
        const isTrueHex = hexCode.startsWith("#")

        // Let hex codes override fallback words to prevent "Green" and "#008800" appearing as two
        if (!availableColorsMap.has(lowerName) || isTrueHex) {
          availableColorsMap.set(lowerName, {
            name,
            // Prioritize true hex code over fallback "Green" parsing
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
      className="content-container py-6 pt-24 sm:pt-28 pb-24"
      data-testid="category-container"
    >
      {/* Page Header */}
      <div className="mb-12 px-4 sm:px-0 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-foreground tracking-tight mb-3">
          {title}
        </h1>
        <p className="text-base text-muted-foreground font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
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

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-[260px] flex-shrink-0">
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
        </aside>

        {/* Product Listing Area */}
        <div className="flex-1 min-w-0 px-4 sm:px-0">
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

export default StoreStyle1
