import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowLeft } from "lucide-react"
import { mockPromotions } from "@/lib/mock-data"
import { mockProducts } from "@/lib/mock-data"
import ProductCard from "@/components/product-card"
import CopyButton from "@/components/copy-button"
import { formatCurrency } from "@/lib/utils"

interface PromoPageProps {
  params: {
    slug: string
  }
}

export default function PromoPage({ params }: PromoPageProps) {
  // Em um caso real, buscaríamos a promoção pelo slug
  // Para este exemplo, vamos usar a primeira promoção do mock
  const promotion = mockPromotions[0]

  if (!promotion) {
    notFound()
  }

  // Filtrar produtos com desconto
  const productsWithDiscount = mockProducts.filter((product) => product.oldPrice).slice(0, 8)

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/promocoes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Promoções
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-8 text-white">
            <Badge variant="outline" className="bg-white/10 text-white border-white/20 mb-4">
              <Clock className="mr-2 h-4 w-4" /> Oferta por tempo limitado
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{promotion.name}</h1>

            <p className="text-white/80 mb-6">
              Aproveite descontos incríveis em produtos selecionados. Promoção válida até{" "}
              {new Date(promotion.endDate).toLocaleDateString("pt-BR")}.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="bg-white/10 border border-white/20 rounded-md px-6 py-3 flex items-center gap-2">
                <span className="text-xl font-bold">{promotion.code}</span>
                <CopyButton textToCopy={promotion.code} />
              </div>

              <div>
                <span className="text-sm text-white/70">Desconto de </span>
                <span className="text-xl font-bold">
                  {promotion.discountType === "percentage"
                    ? `${promotion.discountValue}%`
                    : formatCurrency(promotion.discountValue)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Produtos em Promoção</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {productsWithDiscount.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Detalhes da Promoção</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Código do Cupom</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-semibold">{promotion.code}</span>
                    <CopyButton textToCopy={promotion.code} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Desconto</h4>
                  <p className="font-semibold">
                    {promotion.discountType === "percentage"
                      ? `${promotion.discountValue}%`
                      : formatCurrency(promotion.discountValue)}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Validade</h4>
                  <p className="font-semibold">
                    {new Date(promotion.startDate).toLocaleDateString("pt-BR")} até{" "}
                    {new Date(promotion.endDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Valor Mínimo</h4>
                  <p className="font-semibold">
                    {promotion.minPurchase > 0 ? formatCurrency(promotion.minPurchase) : "Sem valor mínimo"}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Como Usar</h4>
                  <ol className="mt-2 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-red-100 text-red-600 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        1
                      </span>
                      <span>Adicione os produtos desejados ao carrinho</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-100 text-red-600 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        2
                      </span>
                      <span>No carrinho, insira o código do cupom</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-100 text-red-600 rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        3
                      </span>
                      <span>Clique em "Aplicar" e o desconto será calculado automaticamente</span>
                    </li>
                  </ol>
                </div>
              </div>

              <Button className="w-full mt-6 bg-red-600 hover:bg-red-700">
                <Link href="/produtos">Ver Todos os Produtos</Link>
              </Button>
            </CardContent>
          </Card>

          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium flex items-center text-yellow-800">
              <Clock className="mr-2 h-5 w-5" />
              Oferta por tempo limitado
            </h3>
            <p className="mt-2 text-sm text-yellow-700">
              Esta promoção é válida por tempo limitado e pode ser encerrada a qualquer momento sem aviso prévio.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
