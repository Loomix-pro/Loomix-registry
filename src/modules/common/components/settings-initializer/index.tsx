"use client"

import { setClientSettings } from "@lib/util/money"
import { StorefrontSettings } from "@lib/data/strapi-settings"

export default function SettingsInitializer({
  settings,
}: {
  settings: StorefrontSettings
}) {
  setClientSettings(settings)
  return null
}
