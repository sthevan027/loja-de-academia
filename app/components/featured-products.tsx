import { getFeaturedProducts } from "@/lib/products"
import ProductGrid from "./product-grid"

export default async function FeaturedProducts() {
  try {
    const products = await getFeaturedProducts()

    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Produtos em Destaque</h2>
        <ProductGrid products={products} />
      </div>
    )
  } catch (error) {
    console.error("Erro ao carregar produtos em destaque:", error)
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Produtos em Destaque</h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>Não foi possível carregar os produtos em destaque. Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }
}
