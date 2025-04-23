"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"

interface ProductsClientPageProps {
  products: any[]
  filters: any[]
  priceRange: { min: number; max: number }
  searchParams: any
  activeFilters: Record<string, string[]>
  currentUrl: string
}

export default function ProductsClientPage({
  products,
  filters,
  priceRange,
  searchParams,
  activeFilters,
  currentUrl,
}: ProductsClientPageProps) {
  const router = useRouter()
  const [minPrice, setMinPrice] = useState(priceRange.min)
  const [maxPrice, setMaxPrice] = useState(priceRange.max)

  useEffect(() => {
    setMinPrice(priceRange.min)
    setMaxPrice(priceRange.max)
  }, [priceRange.min, priceRange.max])

  const handlePriceChange = () => {
    const url = new URL(currentUrl, window.location.origin)

    url.searchParams.set("min", minPrice.toString())
    url.searchParams.set("max", maxPrice.toString())

    router.push(url.pathname + url.search)
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {/* Filtros */}
      <aside className="md:col-span-1">
        <ProductFilters filters={filters} activeFilters={activeFilters} currentUrl={currentUrl} />
      </aside>

      {/* Listagem de Produtos */}
      <div className="md:col-span-3">
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
