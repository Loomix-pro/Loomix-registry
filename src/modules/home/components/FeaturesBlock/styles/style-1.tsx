import React from "react"
import FeatureIcon from "./FeatureIcon"

/**
 * Guide for creating a new Features Block style
 *
 * This component acts as a UI block to display a list of store features or highlights
 * (e.g., "Free Shipping", "24/7 Support", "Secure Payments").
 * If you intend to create a new style (e.g., style-3), you must consider the following:
 *
 * 1. Received Data (Props):
 *    - `title`: An optional main heading for the features block.
 *    - `features`: An array of feature objects. Each feature typically contains an `id`,
 *      `title`, `description`, and optionally an `icon` or `image`.
 *
 * 2. Component Structure:
 *    - Header section: Renders the `title` if provided.
 *    - Features Grid/List: Iterates over the `features` array and renders individual feature items.
 *
 * 3. Feature Icons:
 *    - The `FeatureIcon` helper component is typically used to render the appropriate SVG icon
 *      based on the feature data. You can adjust its sizing or wrap it in styled containers.
 *
 * 4. Final Output (Return):
 *    Your component should return a JSX section containing the layout for the features.
 *    Ensure you use responsive design classes (e.g., switching from 1 column on mobile
 *    to 4 columns on large screens) so the block fits well within any page container.
 */
export default function Style1({ features }: FeaturesStyleProps) {
  return (
    <section className="w-full pt-4 overflow-hidden">
      <div className="content-container">
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          dir="rtl"
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative flex flex-row items-center p-6 rounded-3xl bg-card border border-border shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden hover:-translate-y-1 transition-all duration-500 ease-out"
            >
              {/* Glowing Ambient Blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/5 rounded-full blur-[40px] opacity-40 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />

              <div className="relative flex-shrink-0 flex items-center justify-center w-14 h-14 ml-5 bg-secondary/50 backdrop-blur-md rounded-2xl text-primary group-hover:text-accent group-hover:scale-110 border border-border shadow-sm transition-all duration-500 z-10">
                <FeatureIcon feature={feature} iconSize={26} />
              </div>

              <div className="flex-1 text-right relative z-10">
                <h3 className="font-bold text-[16px] mb-1.5 text-card-foreground transition-colors">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-[13px] leading-relaxed text-muted-foreground font-light">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
