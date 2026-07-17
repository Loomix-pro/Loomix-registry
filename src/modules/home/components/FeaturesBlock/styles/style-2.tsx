import React from "react"
import FeatureIcon from "./FeatureIcon"

export default function Style2({ features }: FeaturesStyleProps) {
  return (
    <section className="w-full overflow-hidden">
      <div className="content-container">
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto lg:gap-10"
          dir="rtl"
        >
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative flex flex-col items-center text-center p-8 rounded-[32px] bg-card overflow-hidden border border-border shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-xl hover:-translate-y-2 transition-all duration-700"
            >
              {/* Spotlight Glow from Top */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-primary/15 via-accent/5 to-transparent rounded-full blur-[40px] opacity-50 group-hover:opacity-80 transition-all duration-700 pointer-events-none" />

              <div className="relative flex-shrink-0 flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-tr from-secondary/50 to-muted/50 backdrop-blur-xl rounded-[20px] text-primary group-hover:text-accent border border-border group-hover:border-primary/30 shadow-sm transition-all duration-500 z-10">
                <FeatureIcon feature={feature} iconSize={30} />
              </div>

              <div className="flex-1 relative z-10">
                <h3 className="font-bold text-[18px] mb-3 text-card-foreground transition-colors">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-[14px] leading-relaxed text-muted-foreground">
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
