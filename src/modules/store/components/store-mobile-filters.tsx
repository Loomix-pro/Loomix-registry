import { isTomanEnabled } from "@lib/util/storefront-settings"

import { MobileFilterSheet } from "../components/mobile-filter-sheet"
import { getStoreFilterOptions } from "../lib/get-store-filter-options"

export default async function StoreMobileFilters({
  categoryId,
}: {
  categoryId?: string
}) {
  const { categories, tags, activeCampaigns, availableColors } =
    await getStoreFilterOptions(categoryId)

  return (
    <MobileFilterSheet
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
