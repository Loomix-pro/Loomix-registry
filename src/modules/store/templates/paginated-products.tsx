import { Suspense } from "react"
import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getStorefrontSettings } from "@lib/data/strapi-settings"
import ProductCard from "@modules/products/components/product-cards"
import { Pagination } from "@modules/store/components/pagination"
import { SortBar, SortOptions } from "@modules/store/components/sort-bar"
import { getTranslations } from "next-intl/server"

const PRODUCT_LIMIT = 12

interface PaginatedProductsParams {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  tag_id?: string[]
  id?: string[]
  order?: string
  price_min?: number
  price_max?: number
  only_available?: string // "true" or "false"
  category?: string[] // category handles
  color?: string // comma-separated color names
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  searchParams,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  searchParams?: {
    price_min?: string
    price_max?: string
    only_available?: string
    color?: string
    category_id?: string | string[]
    tag_id?: string | string[]
  }
}) {
  const t = await getTranslations("Store")
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams.collection_id = [collectionId]
  }

  if (categoryId) {
    queryParams.category_id = [categoryId]
  }

  if (productsIds) {
    queryParams.id = productsIds
  }

  // Pass through search params for filtering
  if (searchParams) {
    if (searchParams.price_min)
      queryParams.price_min = Number(searchParams.price_min)
    if (searchParams.price_max)
      queryParams.price_max = Number(searchParams.price_max)
    if (searchParams.only_available)
      queryParams.only_available = searchParams.only_available
    if (searchParams.color) queryParams.color = searchParams.color

    // Handle category filtering from sidebar
    if (searchParams.category_id) {
      const categoryIds = Array.isArray(searchParams.category_id)
        ? searchParams.category_id
        : [searchParams.category_id]

      // Merge with existing categoryId if present
      if (queryParams.category_id) {
        queryParams.category_id = [...queryParams.category_id, ...categoryIds]
      } else {
        queryParams.category_id = categoryIds
      }
    }

    // Handle tag filtering from sidebar
    if (searchParams.tag_id) {
      const tagIds = Array.isArray(searchParams.tag_id)
        ? searchParams.tag_id
        : [searchParams.tag_id]

      if (queryParams.tag_id) {
        queryParams.tag_id = [...queryParams.tag_id, ...tagIds]
      } else {
        queryParams.tag_id = tagIds
      }
    }
  }

  if (sortBy === "created_at") {
    queryParams.order = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Fetch Strapi settings to determine which card to use
  const settings = await getStorefrontSettings()

  // Determine card type based on page context
  let cardType = settings.productCard.storeCardType // Default to store

  if (categoryId) {
    cardType = settings.productCard.categoryCardType
  } else if (collectionId) {
    cardType = settings.productCard.collectionCardType
  }

  const {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  // Filter params for client-side filtering (price, availability)
  // Logic is handled in listProductsWithSort now

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <Suspense fallback={null}>
        <SortBar count={count} sortBy={sortBy ?? "created_at"} />
      </Suspense>

      {products.length > 0 ? (
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
          data-testid="products-list"
        >
          {products.map((p) => {
            return (
              <li key={p.id}>
                <ProductCard product={p} region={region} cardType={cardType} />
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="bg-muted/10 rounded-3xl p-20 text-center border border-dashed border-border">
          <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-muted-foreground/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {t("no_products_found")}
          </h3>
          <p className="text-muted-foreground">
            {t("no_products_description")}
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <Suspense fallback={null}>
          <Pagination
            data-testid="product-pagination"
            page={page}
            totalPages={totalPages}
          />
        </Suspense>
      )}
    </>
  )
}
