import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProductById, getRelatedProducts } from "@/lib/products"
import { getProductFilters } from "@/lib/product-filters"
import ProductDetail from "./ProductDetail"
import ProductsLoading from "@/components/products-loading"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    return {
      title: "Produto não encontrado | Academia Fitness",
      description: "O produto que você está procurando não foi encontrado.",
    }
  }

  return {
    title: `${product.name} | Academia Fitness`,
    description: product.description || `Compre ${product.name} na Academia Fitness`,
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  // Buscar filtros do produto
  const productFilters = await getProductFilters(Number(product.id))

  // Buscar produtos relacionados
  const relatedProducts = await getRelatedProducts(product.category_id, product.id)

  return (
    <div className="container py-8">
      <Suspense fallback={<ProductsLoading />}>
        <ProductDetail product={product} filters={productFilters} relatedProducts={relatedProducts} />
      </Suspense>
    </div>
  )
}
