import React, { Suspense } from "react"
import { getStorefrontSettings } from "@lib/data/strapi-settings"

interface PageTransitionProps {
  children: React.ReactNode
}

export default async function PageTransition({ children }: PageTransitionProps) {
  const settings = await getStorefrontSettings()

  const transitionStyle = settings?.pageTransition?.style || "style-1"

  if (transitionStyle === "none") {
    return <>{children}</>
  }

  // Dynamically import the corresponding style component by name.
  // Adding a new style (e.g. style-4) only requires creating the folder —
  // no changes needed here.
  try {
    const StyleComponent = (await import(`./styles/${transitionStyle}`)).default
    return <StyleComponent>{children}</StyleComponent>
  } catch {
    // Fallback to style-1 if the requested style module doesn't exist
    const Fallback = (await import("./styles/style-1")).default
    return <Fallback>{children}</Fallback>
  }
}
