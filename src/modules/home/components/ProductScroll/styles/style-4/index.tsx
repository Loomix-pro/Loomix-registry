"use client"

import React from "react"
import ProductCard from "@modules/products/components/product-cards"

export default function Style4({
  products = [],
  region,
  title = "Test Style 4",
  description = "This is a simple style for testing purposes.",
  cardStyle = "card-1",
}: any) {
  if (!products || products.length === 0 || !region) return null

  return (
    <div className="bg-background text-foreground py-12 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="mt-4 text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="w-full">
              <ProductCard
                product={product}
                region={region}
                cardType={cardStyle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
