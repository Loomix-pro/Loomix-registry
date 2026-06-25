/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/prefer-nullish-coalescing, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/consistent-type-definitions, @typescript-eslint/no-deprecated, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-empty-function, @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-optional-chain, @typescript-eslint/no-floating-promises, @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-conversion, @typescript-eslint/no-base-to-string */
import React from "react"
import Image from "next/image"
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset,
  CreditCard,
  Award,
  Percent,
  Zap,
  HelpCircle,
} from "lucide-react"
import { FeatureItem } from "@lib/data/homepage"

interface FeatureIconProps {
  feature: FeatureItem
  iconSize?: number
  className?: string
}

export default function FeatureIcon({
  feature,
  iconSize = 24,
  className,
}: FeatureIconProps) {
  // 1. If a custom uploaded image/SVG exists, use it
  if (feature.icon?.url) {
    return (
      <Image
        src={feature.icon.url}
        alt={feature.icon.alternativeText || feature.title}
        width={iconSize}
        height={iconSize}
        className={`object-contain drop-shadow-sm ${className || ""}`}
      />
    )
  }

  // 2. If no custom image, use pre-defined Lucide icon
  if (feature.icon_name) {
    switch (feature.icon_name) {
      case "truck":
        return <Truck size={iconSize} className={className} />
      case "shield-check":
        return <ShieldCheck size={iconSize} className={className} />
      case "rotate-ccw":
        return <RotateCcw size={iconSize} className={className} />
      case "headset":
        return <Headset size={iconSize} className={className} />
      case "credit-card":
        return <CreditCard size={iconSize} className={className} />
      case "award":
        return <Award size={iconSize} className={className} />
      case "percent":
        return <Percent size={iconSize} className={className} />
      case "zap":
        return <Zap size={iconSize} className={className} />
      default:
        break
    }
  }

  // 3. Fallback default icon
  return <HelpCircle size={iconSize} className={className} />
}
