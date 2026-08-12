import { STYLES } from "./registry"
import { getTranslations } from "next-intl/server"
import React from "react"
import BlockError from "../../BlockRenderer/block-error"

export default async function SplitBannerStage({
  banner,
}: SplitBannerStageProps) {
  if (!banner) return null

  const t = await getTranslations("Blocks")

  const formattedStyle = banner.style
    ? banner.style
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
    : "style-1"

  const DynamicComponent = STYLES[formattedStyle] || STYLES["style-1"]

  if (!DynamicComponent) return null

  return <DynamicComponent banner={banner} />
}
