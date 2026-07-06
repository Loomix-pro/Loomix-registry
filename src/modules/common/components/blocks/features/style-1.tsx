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
export default function Style1({ title, features }: FeaturesStyleProps) {
  return (
    <section className="pt-0 pb-12 md:pt-0 md:pb-16 w-full overflow-hidden">
      <div className="content-container">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-10 text-ui-fg-base tracking-tight">
            {title}
          </h2>
        )}

        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          dir="rtl"
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group flex flex-row items-center p-5 bg-[#0a0f1a] rounded-2xl border border-[#1a2138] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)] hover:border-[#4f46e5]/40 hover:shadow-[0_8px_30px_-10px_rgba(79,70,229,0.2)] transition-all duration-300 ease-out"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 ml-4 bg-[#111727] rounded-xl text-indigo-400 group-hover:scale-105 group-hover:bg-[#1a2138] transition-all duration-300">
                <FeatureIcon feature={feature} iconSize={26} />
              </div>

              <div className="flex-1 text-right">
                <h3 className="font-semibold text-[15px] mb-1.5 text-gray-100 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-[13px] leading-relaxed text-gray-400 font-light">
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
