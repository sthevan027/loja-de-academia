"use client"

import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, ShoppingCart, Star } from "lucide-react"
import { getProductById, getRelatedProducts } from "@/lib/products"
import { formatCurrency } from "@/lib/utils"
import ProductCard from "@/components/product-card"
import AddToCartButton from "@/components/add-to-cart-button"
import { useEffect, useState } from "react"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPageClient({ params }: ProductPageProps) {
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [discountPercentage, setDiscountPercentage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const productData = await getProductById(params.id)

      if (!productData) {
        notFound()
        return
      }

      // Adicionar tamanhos disponíveis com base na categoria
      if (!productData.availableSizes) {
        if (
          productData.category.toLowerCase().includes("roupa") ||
          productData.category.toLowerCase().includes("camiseta") ||
          productData.category.toLowerCase().includes("calça") ||
          productData.category.toLowerCase().includes("shorts")
        ) {
          productData.availableSizes = ["PP", "P", "M", "G", "GG", "XG"]
        } else if (
          productData.category.toLowerCase().includes("calçado") ||
          productData.category.toLowerCase().includes("tênis")
        ) {
          productData.availableSizes = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
        }
      }

      setProduct(productData)

      const relatedProductsData = await getRelatedProducts(productData.category, productData.id)
      setRelatedProducts(relatedProductsData)

      const discount = productData.oldPrice
        ? Math.round(((productData.oldPrice - productData.price) / productData.oldPrice) * 100)
        : 0
      setDiscountPercentage(discount)
    }

    fetchData()
  }, [params.id])

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/produtos">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Produtos
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />

          {product.oldPrice && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-md text-sm font-medium">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-muted-foreground">(24 avaliações)</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.oldPrice)}</span>
              )}
            </div>

            {product.installments && (
              <p className="text-sm text-muted-foreground mt-1">
                ou {product.installments}x de {formatCurrency(product.price / product.installments)} sem juros
              </p>
            )}
          </div>

          {/* Tamanhos disponíveis */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Tamanho</h3>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <div key={size.toString()} className="size-selector">
                    {size}
                  </div>
                ))}
              </div>
              <style jsx>{`
                .size-selector {
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  width: 40px;
                  height: 40px;
                  border: 1px solid #e2e8f0;
                  border-radius: 0.375rem;
                  font-size: 0.875rem;
                  cursor: pointer;
                  transition: all 0.2s;
                }
                .size-selector:hover {
                  border-color: #ef4444;
                  background-color: #fef2f2;
                }
                .size-selector.selected {
                  border-color: #ef4444;
                  background-color: #ef4444;
                  color: white;
                }
              `}</style>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Disponível para entrega imediata</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Frete grátis para compras acima de R$ 200</span>
            </div>
            <div className="flex items-center text-sm">
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Garantia de 30 dias</span>
            </div>
          </div>

          <Separator className="my-6" />

          <AddToCartButton product={product} />

          <Button variant="outline" className="mt-4">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Comprar Agora
          </Button>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-12">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="description">Descrição</TabsTrigger>
          <TabsTrigger value="specifications">Especificações</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Sobre o Produto</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {product.description ||
                `
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              
              Características:
              - Alta qualidade
              - Material durável
              - Design moderno
              - Confortável para uso diário
              - Perfeito para treinos intensos
              `}
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="specifications" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Especificações Técnicas</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted p-3 rounded-md">
                  <span className="text-sm font-medium">Material</span>
                  <p className="text-sm text-muted-foreground">Poliéster e Elastano</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <span className="text-sm font-medium">Composição</span>
                  <p className="text-sm text-muted-foreground">85% Poliéster, 15% Elastano</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <span className="text-sm font-medium">Tecnologia</span>
                  <p className="text-sm text-muted-foreground">Dry-Fit</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <span className="text-sm font-medium">Indicado para</span>
                  <p className="text-sm text-muted-foreground">Treinos de alta intensidade</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <span className="text-sm font-medium">Garantia</span>
                  <p className="text-sm text-muted-foreground">30 dias contra defeitos de fabricação</p>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <span className="text-sm font-medium">Origem</span>
                  <p className="text-sm text-muted-foreground">Nacional</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Avaliações dos Clientes</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full h-12 w-12 flex items-center justify-center">
                  <span className="font-medium">MC</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">Maria C.</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Produto de excelente qualidade! Superou minhas expectativas.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full h-12 w-12 flex items-center justify-center">
                  <span className="font-medium">JS</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">João S.</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Muito bom, mas poderia ter mais opções de cores.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full h-12 w-12 flex items-center justify-center">
                  <span className="font-medium">PL</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">Pedro L.</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Entrega rápida e produto conforme descrito. Recomendo!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Suspense fallback={<p>Carregando produtos relacionados...</p>}>
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Suspense>
          </div>
        </div>
      )}
    </div>
  )
}
