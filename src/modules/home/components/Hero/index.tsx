import { STYLES } from "./registry"

export default async function HeroStage({ section }: HeroBlockProps) {
  if (!section) return null

  const formattedStyle = section.style
    ? section.style
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
    : "style-1"

  const DynamicComponent = STYLES[formattedStyle] || STYLES["style-1"]

  if (!DynamicComponent) return null

  return <DynamicComponent section={section} />
}
