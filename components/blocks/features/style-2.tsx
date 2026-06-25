import React from "react"
import FeatureIcon from "./FeatureIcon"

export default function Style2({ title, features }: FeaturesStyleProps) {
  return (
    <section className="py-12 md:py-16 w-full overflow-hidden">
      <div className="content-container">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-10 text-ui-fg-base tracking-tight">
            {title}
          </h2>
        )}

        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto lg:gap-10"
          dir="rtl"
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group flex flex-col items-center text-center p-8 bg-ui-bg-subtle rounded-2xl border border-ui-border-base hover:bg-ui-bg-base transition-colors duration-300"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 mb-5 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:-translate-y-1 transition-transform duration-300">
                <FeatureIcon feature={feature} iconSize={30} />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 text-ui-fg-base">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-[13px] leading-relaxed text-ui-fg-subtle">
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
