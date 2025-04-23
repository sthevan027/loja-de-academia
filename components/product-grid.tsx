"use client"

import { useEffect, useState } from "react"
import { Product } from "@/lib/types"
import ProductCard from "@/components/product-card"
import { Loader2 } from "lucide-react"

interface ProductGridProps {
  category?: string
  subcategory?: string
}

export default function ProductGrid({ category, subcategory }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true)
        const url = new URL("/api/products", window.location.origin)
        if (category) url.searchParams.append("category", category)
        if (subcategory) url.searchParams.append("subcategory", subcategory)

        const response = await fetch(url.toString())
        if (!response.ok) throw new Error("Erro ao carregar produtos")

        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [category, subcategory])

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center">
        <p className="text-gray-600">Nenhum produto encontrado nesta categoria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
