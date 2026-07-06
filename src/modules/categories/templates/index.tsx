import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@/modules/common/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/sort-bar"
import { FilterSidebar } from "@modules/store/components/filter-sidebar"
import { MobileFilterSheet } from "@modules/store/components/mobile-filter-sheet"
import { listTags } from "@lib/data/tags"
import InteractiveLink from "@modules/common/components/interactive-link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getTranslations } from "next-intl/server"
import { isTomanEnabled } from "@lib/util/storefront-settings"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  searchParams,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  searchParams?: any
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const t = await getTranslations("Layout.nav")

  if (!category || !countryCode) notFound()

  // Removed detailed category list for sidebar as per request
  // const categories = await listCategories()
  const tags = await listTags()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="content-container py-6" data-testid="category-container">
      {/* Breadcrumbs */}
      <div className="flex flex-row mb-4 text-sm text-ui-fg-subtle gap-2 px-4 sm:px-0">
        <LocalizedClientLink className="hover:text-black" href="/store">
          {t("store")}
        </LocalizedClientLink>
        <span>/</span>
        {parents &&
          parents.reverse().map((parent) => (
            <span key={parent.id} className="flex gap-2">
              <LocalizedClientLink
                className="hover:text-black"
                href={`/categories/${parent.handle}`}
              >
                {parent.name}
              </LocalizedClientLink>
              <span>/</span>
            </span>
          ))}
        <span className="font-semibold text-gray-900">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="mb-12 max-w-2xl mx-auto text-center px-4 sm:px-0">
        <h1
          className="text-4xl font-black text-gray-900 mb-4 leading-tight text-center"
          data-testid="category-page-title"
        >
          {category.name}
        </h1>

        {category.description && (
          <p className="text-gray-500 text-lg leading-relaxed text-center">
            {category.description}
          </p>
        )}

        {/* Subcategories */}
        {category.category_children &&
          category.category_children.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {category.category_children.map((c) => (
                <InteractiveLink key={c.id} href={`/categories/${c.handle}`}>
                  <div className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    {c.name}
                  </div>
                </InteractiveLink>
              ))}
            </div>
          )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Mobile Filter Trigger */}
        <Suspense fallback={null}>
          <MobileFilterSheet
            categories={[]}
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
              categories={[]}
              tags={tags}
              initialMinPrice={0}
              initialMaxPrice={500000000}
              tomanEnabled={isTomanEnabled()}
            />
          </Suspense>
        </aside>

        {/* Product Listing Area */}
        <div className="lg:w-3/4 w-full px-4 sm:px-0">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
