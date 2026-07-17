import { Suspense } from "react"

import SkeletonProductGrid from "@/modules/common/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/sort-bar"
import { FilterSidebar } from "@modules/store/components/filter-sidebar"
import { MobileFilterSheet } from "@modules/store/components/mobile-filter-sheet"
import { listCategories } from "@lib/data/categories"
import { listTags } from "@lib/data/tags"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { isTomanEnabled } from "@lib/util/storefront-settings"

export default async function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
  searchParams?: any
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const categories = await listCategories()
  const tags = await listTags()

  return (
    <div className="content-container py-6" data-testid="collection-container">
      {/* Breadcrumbs */}
      <div className="flex flex-row mb-4 text-sm text-ui-fg-subtle gap-2 px-4 sm:px-0">
        <LocalizedClientLink className="hover:text-black" href="/store">
          Store
        </LocalizedClientLink>
        <span>/</span>
        <span className="font-semibold text-gray-900">{collection.title}</span>
      </div>

      {/* Collection Header */}
      <div className="mb-12 max-w-2xl mx-auto text-center px-4 sm:px-0">
        <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight text-center">
          {collection.title}
        </h1>

        {/* Collection doesn't usually have a description in Medusa type, but if it did... */}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Mobile Filter Trigger */}
        <Suspense fallback={null}>
          <MobileFilterSheet
            categories={categories}
            tags={tags}
            initialMinPrice={0}
            initialMaxPrice={500000000}
            tomanEnabled={isTomanEnabled()}
          />
        </Suspense>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-1/4 w-full">
          <Suspense fallback={null}>
            <FilterSidebar
              categories={categories}
              tags={tags}
              initialMinPrice={0}
              initialMaxPrice={500000000}
              tomanEnabled={isTomanEnabled()}
            />
          </Suspense>
        </aside>

        {/* Product Listing Area */}
        <div className="lg:w-3/4 w-full px-4 sm:px-0">
          <Suspense
            key={`${pageNumber}-${sort}-${JSON.stringify(searchParams)}`}
            fallback={<SkeletonProductGrid />}
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              collectionId={collection.id}
              countryCode={countryCode}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
