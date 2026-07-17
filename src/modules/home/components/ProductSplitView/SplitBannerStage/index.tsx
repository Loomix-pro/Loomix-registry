import { getTranslations } from "next-intl/server"
import React from "react"
import BlockError from "../../BlockRenderer/block-error"

export default async function SplitBannerStage({ banner }: SplitBannerStageProps) {
  if (!banner) return null

  const t = await getTranslations("Blocks")

  const formattedStyle = banner.style
    ? banner.style.trim().toLowerCase().replace(/[^a-z0-9-]/g, "")
    : "style-1"

  let DynamicComponent
  try {
    const mod = await import(`./styles/${formattedStyle}`)
    DynamicComponent = mod.default || Object.values(mod)[0]
  } catch (error: any) {
    console.error(`SplitBannerStage: style "${formattedStyle}" not found.`, error)
    return (
      <BlockError
        error={error}
        formattedStyle={formattedStyle}
        blockName={t("split_banner")}
      />
    )
  }

  if (!DynamicComponent) return null

  return <DynamicComponent banner={banner} />
}
