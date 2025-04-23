import Image from "next/image"
import Link from "next/link"
import { getProductBySlug, getProducts } from "../../lib/products"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const products = await getProducts(20)

  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm text-gray-600 hover:text-red-600">
          Home
        </Link>{" "}
        &gt;{" "}
        <Link
          href={`/categorias/${product.category_name?.toLowerCase().replace(/\s+/g, "-")}`}
          className="text-sm text-gray-600 hover:text-red-600"
        >
          {product.category_name}
        </Link>{" "}
        &gt; <span className="text-sm text-gray-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image src={product.image_url || "/placeholder.svg"} alt={product.name} fill className="object-contain p-4" />
          {product.is_new && (
            <div className="absolute left-4 top-4 z-10 bg-red-600 px-2 py-1 text-xs font-bold text-white">NOVO</div>
          )}

          {product.old_price && (
            <div className="absolute right-4 top-4 z-10 bg-green-600 px-2 py-1 text-xs font-bold text-white">
              {discountPercentage}% OFF
            </div>
          )}
        </div>

        <div>
          <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
          <div className="mb-4">
            <span className="text-sm text-gray-600">Categoria: </span>
            <Link
              href={`/categorias/${product.category_name?.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-red-600 hover:underline"
            >
              {product.category_name}
            </Link>
          </div>

          <div className="mb-6">
            {product.old_price && (
              <div className="text-sm text-gray-500 line-through">De: {formatPrice(product.old_price)}</div>
            )}
            <div className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</div>
            <div className="text-sm text-gray-700">
              ou {product.installments}x de {formatPrice(product.price / product.installments)} sem juros
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold">Descrição</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold">Disponibilidade</h3>
            <p className={`text-sm ${product.inventory > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.inventory > 0 ? `${product.inventory} unidades em estoque` : "Produto indisponível"}
            </p>
          </div>

          <button
            className="w-full rounded bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700 disabled:bg-gray-400"
            disabled={product.inventory <= 0}
          >
            ADICIONAR AO CARRINHO
          </button>
        </div>
      </div>
    </div>
  )
}
