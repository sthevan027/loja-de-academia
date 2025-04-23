import Link from "next/link"
import Image from "next/image"
import type { Product } from "../lib/products"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Formatar preço para o formato brasileiro (R$ 99,90)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  // Calcular desconto em porcentagem
  const discountPercentage = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
      {product.is_new && (
        <div className="absolute left-0 top-0 z-10 bg-red-600 px-2 py-1 text-xs font-bold text-white">NOVO</div>
      )}

      {product.old_price && (
        <div className="absolute right-0 top-0 z-10 bg-green-600 px-2 py-1 text-xs font-bold text-white">
          {discountPercentage}% OFF
        </div>
      )}

      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <span className="text-xs text-gray-500">{product.category_name}</span>
          <h3 className="mb-2 text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>

          <div className="flex flex-col">
            {product.old_price && (
              <span className="text-xs text-gray-500 line-through">{formatPrice(product.old_price)}</span>
            )}

            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>

            <span className="text-xs text-gray-600">
              ou {product.installments}x de {formatPrice(product.price / product.installments)}
            </span>
          </div>

          <button className="mt-3 w-full rounded bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700">
            COMPRAR
          </button>
        </div>
      </Link>
    </div>
  )
}
