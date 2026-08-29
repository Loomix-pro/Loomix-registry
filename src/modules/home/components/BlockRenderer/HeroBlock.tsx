import HeroStage from "@modules/home/components/Hero"
import { HeroBlock as BlockType } from "@lib/data/homepage"

interface HeroBlockRendererProps {
  block: BlockType
  index: number
}

export default async function HeroBlockRenderer({
  block,
  index,
}: HeroBlockRendererProps) {
  if (!block.section) return null

  return <HeroStage key={`${block.id || index}-hero`} section={block.section} />
}
