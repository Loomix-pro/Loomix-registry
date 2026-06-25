import React from "react"
import FeatureIcon from "./FeatureIcon"

export default function Style1({ title, features }: FeaturesStyleProps) {
  return (
    <section className="py-12 md:py-16 w-full overflow-hidden">
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
