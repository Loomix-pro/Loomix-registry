"use client"
import React from "react"
import SilkBackground from "./styles/SilkBackground"
import GridBackground from "./styles/GridBackground"
import SolidBackground from "./styles/SolidBackground"

interface BackgroundRendererProps {
  backgroundSettings?: {
    style: "silk" | "grid" | "solid" | "none"
    opacityLight?: number
    opacityDark?: number
  }
}

const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({ backgroundSettings }) => {
  if (!backgroundSettings || backgroundSettings.style === "none") {
    return null
  }

  const { style, opacityLight, opacityDark } = backgroundSettings

  switch (style) {
    case "silk":
      return <SilkBackground opacityLight={opacityLight} opacityDark={opacityDark} />
    case "grid":
      return <GridBackground opacityLight={opacityLight} opacityDark={opacityDark} />
    case "solid":
      return <SolidBackground opacityLight={opacityLight} opacityDark={opacityDark} />
    default:
      return null
  }
}

export default BackgroundRenderer
