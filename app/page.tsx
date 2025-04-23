import { Suspense } from "react"
import HeroBanner from "@/components/hero-banner"
import ProductGrid from "@/components/product-grid"
import { getFeaturedProducts } from "@/lib/products"

export default async function Home() {
  // Carregar apenas produtos em destaque para a página inicial
  const featuredProducts = await getFeaturedProducts()

  return (
    <main>
      {/* Hero Banner */}
      <HeroBanner />

      {/* Produtos em Destaque */}
      <Suspense fallback={<div className="py-12 text-center">Carregando produtos...</div>}>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Produtos em Destaque</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      </Suspense>
    </main>
  )
}
