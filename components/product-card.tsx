import Image from "next/image"
import Link from "next/link"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calcular desconto apenas se necessário
  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <Link href={`/produtos/${product.id}`} className="relative h-40 w-full overflow-hidden">
        <Image
          src={product.imageUrl || "/placeholder.svg?height=400&width=300"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />

        {product.oldPrice && (
          <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            -{discountPercentage}%
          </div>
        )}

        {product.isNew && (
          <div className="absolute top-1 right-1 bg-black text-white text-xs px-1.5 py-0.5 rounded-full">Novo</div>
        )}
      </Link>

      <div className="p-2 flex-grow">
        <Link href={`/produtos/${product.id}`}>
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
        </Link>
        <p className="text-xs text-gray-500">{product.category}</p>

        <div className="mt-2">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-base">{formatCurrency(product.price)}</span>
            {product.oldPrice && (
              <span className="text-gray-500 line-through text-xs">{formatCurrency(product.oldPrice)}</span>
            )}
          </div>

          {product.installments && (
            <p className="text-xs text-gray-500">
              ou {product.installments}x de {formatCurrency(product.price / product.installments)}
            </p>
          )}
        </div>
      </div>

      <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-full px-2 py-1.5 text-sm">
        COMPRAR
      </button>
    </div>
  )
}
