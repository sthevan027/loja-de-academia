import type { Product } from "../lib/products"
import ProductCard from "./product-card"

interface ProductGridProps {
  products: Product[]
  title?: string
}

export default function ProductGrid({ products, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-8 text-center">
        <h2 className="text-xl font-bold">Nenhum produto encontrado</h2>
      </div>
    )
  }

  return (
    <section className="py-8">
      {title && <h2 className="mb-6 text-center text-2xl font-bold">{title}</h2>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
