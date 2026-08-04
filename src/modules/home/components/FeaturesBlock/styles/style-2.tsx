import React from "react"
import FeatureIcon from "./FeatureIcon"

export default function Style2({ title, features }: FeaturesStyleProps) {
  return (
    <section className="w-full py-8 overflow-hidden">
      <div className="content-container">
        {title && (
          <div className="mb-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              {title}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group relative flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-card border border-border/70 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-500 overflow-hidden hover:-translate-y-2"
            >
              {/* Top Accent Gradient Line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1 w-12 bg-gradient-to-r from-primary via-accent to-primary rounded-b-full opacity-30 group-hover:w-full group-hover:opacity-100 transition-all duration-500" />

              {/* Background Glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />

              {/* Elevated Icon Container */}
              <div className="relative flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 mb-5 bg-muted/60 group-hover:bg-primary text-primary group-hover:text-primary-foreground rounded-2xl border border-border/80 group-hover:border-primary/20 shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 z-10">
                <FeatureIcon feature={feature} iconSize={28} />
              </div>

              {/* Content */}
              <div className="flex-1 relative z-10 flex flex-col items-center">
                <h3 className="font-bold text-base sm:text-lg mb-2 text-card-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                {feature.description && (
                  <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
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
