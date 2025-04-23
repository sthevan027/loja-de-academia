"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Share2, Star } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import ProductCard from "@/components/product-card"
import { useToast } from "@/components/ui/use-toast"

interface ProductDetailProps {
  product: any
  filters: any[]
  relatedProducts: any[]
}

export default function ProductDetail({ product, filters, relatedProducts }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const { toast } = useToast()

  const handleAddToCart = () => {
    // Implementar lógica para adicionar ao carrinho
    toast({
      title: "Produto adicionado ao carrinho",
      description: `${quantity} unidade(s) de ${product.name} adicionada(s) ao carrinho.`,
    })
  }

  const handleAddToWishlist = () => {
    toast({
      title: "Produto adicionado à lista de desejos",
      description: `${product.name} foi adicionado à sua lista de desejos.`,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copiado",
        description: "O link do produto foi copiado para a área de transferência.",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem do Produto */}
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <Image
            src={product.image_url || "/placeholder.svg?height=600&width=600&query=product"}
            alt={product.name}
            fill
            className="object-cover"
          />
          {product.discount_price && (
            <Badge className="absolute top-4 left-4 bg-red-600">
              {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
            </Badge>
          )}
          {product.is_new && <Badge className="absolute top-4 right-4 bg-green-600">NOVO</Badge>}
        </div>

        {/* Detalhes do Produto */}
        <div className="space-y-6">
          <div>
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
              <span className="ml-2 text-sm text-muted-foreground">(12 avaliações)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              {product.discount_price ? (
                <>
                  <span className="text-3xl font-bold text-red-600">{formatCurrency(product.discount_price)}</span>
                  <span className="ml-2 text-lg text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Em até 12x de {formatCurrency((product.discount_price || product.price) / 12)}
            </p>
            <p className="text-sm text-green-600 font-medium">
              {formatCurrency((product.discount_price || product.price) * 0.9)} à vista (10% de desconto)
            </p>
          </div>

          {/* Filtros do Produto */}
          {filters.length > 0 && (
            <div className="space-y-4">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <h3 className="font-medium">{filter.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {filter.options.map((option: any) => (
                      <Badge key={option.id} variant="outline" className="px-3 py-1">
                        {option.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantidade e Botões */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-medium">Quantidade:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock} disponíveis</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="bg-red-600 hover:bg-red-700 flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" size="icon" onClick={handleAddToWishlist}>
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Descrição e Detalhes */}
      <Card>
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b rounded-none">
            <TabsTrigger value="description" className="flex-1">
              Descrição
            </TabsTrigger>
            <TabsTrigger value="details" className="flex-1">
              Detalhes
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Avaliações
            </TabsTrigger>
          </TabsList>
          <CardContent className="pt-6">
            <TabsContent value="description">
              <div className="prose max-w-none">
                <p>{product.description || "Sem descrição disponível."}</p>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Especificações</h3>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Categoria:</span>
                        <span>{product.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Código:</span>
                        <span>{product.id}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-muted-foreground">Disponibilidade:</span>
                        <span>{product.stock > 0 ? "Em estoque" : "Esgotado"}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="space-y-4">
                <p>Avaliações em breve.</p>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Produtos Relacionados */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
