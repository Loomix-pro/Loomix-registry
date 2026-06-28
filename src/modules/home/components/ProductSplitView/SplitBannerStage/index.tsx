import React from "react"
import BlockError from "../../../../common/components/blocks/block-error"
import { getTranslations } from "next-intl/server"

export default async function SplitBannerStage({ banner }: SplitBannerStageProps) {
  if (!banner) return null
  const t = await getTranslations("Blocks")

  let formattedStyle = banner.style ? banner.style.trim().toLowerCase() : "style-1"

  let DynamicComponent
  try {
    const mod = await import(
      `../../../../common/components/blocks/ProductSplitView/split-banner/${formattedStyle}`
    )
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`Component style ${formattedStyle} not found or failed to load. Error:`, error)
    return <BlockError error={error} formattedStyle={formattedStyle} blockName={t("split_banner")} />
  }

  if (!DynamicComponent) return null

  return <DynamicComponent banner={banner} />
}
