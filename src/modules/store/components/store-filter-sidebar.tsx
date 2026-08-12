import { isTomanEnabled } from "@lib/util/storefront-settings"

import { FilterSidebar } from "../components/filter-sidebar"
import { getStoreFilterOptions } from "../lib/get-store-filter-options"

export default async function StoreFilterSidebar({
  categoryId,
}: {
  categoryId?: string
}) {
  const { categories, tags, activeCampaigns, availableColors } =
    await getStoreFilterOptions(categoryId)

  return (
    <FilterSidebar
      categories={categories}
      tags={tags}
      availableColors={availableColors}
      activeCampaigns={activeCampaigns}
      initialMinPrice={0}
      initialMaxPrice={500000000}
      tomanEnabled={isTomanEnabled()}
    />
  )
}
