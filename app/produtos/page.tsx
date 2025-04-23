import { Suspense } from "react"
import Link from "next/link"
import { getProducts } from "@/lib/products"
import ProductCard from "@/components/product-card"
import ProductsLoading from "@/components/products-loading"

export const metadata = {
  title: "Produtos | Power Fit",
  description: "Explore nossa coleção de produtos para academia e fitness",
}

export default async function ProductsPage() {
  try {
    // Buscar produtos com uma consulta simples
    const products = await getProducts()

    // Categorias disponíveis
    const categories = [
      { id: "masculino", label: "Roupas Masculinas" },
      { id: "feminino", label: "Roupas Femininas" },
      { id: "acessorios", label: "Acessórios" },
    ]

    return (
      <div className="container py-4">
        {/* Categorias em destaque no topo */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Categorias</h2>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/produtos?categoria=${category.id}`}
                className="block p-2 text-center rounded-lg border text-sm transition-colors hover:bg-red-50 hover:border-red-200"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>

        <h1 className="text-xl font-bold mb-4">Todos os Produtos</h1>

        <Suspense fallback={<ProductsLoading />}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Erro ao carregar produtos:", error)
    return (
      <div className="container py-8">
        <h1 className="text-xl font-bold mb-4">Produtos</h1>
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <h2 className="text-lg font-semibold">Erro ao carregar produtos</h2>
          <p>Ocorreu um erro ao carregar os produtos. Por favor, tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }
}
