import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Tag, Clock, Percent, ArrowRight, Sparkles, FlameIcon as Fire } from "lucide-react"
import { mockProducts } from "@/lib/mock-data"
import ProductCard from "@/components/product-card"
import PromoSubscribe from "@/components/promo-subscribe"
import PromoBanner from "@/components/promo-banner"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export const metadata: Metadata = {
  title: "Promoções | Ritmoalpha",
  description: "Aproveite as melhores ofertas em produtos fitness com descontos imperdíveis",
}

export default function PromocoesPage() {
  // Filtrar produtos com desconto (que têm oldPrice)
  const productsWithDiscount = mockProducts.filter((product) => product.oldPrice)

  // Produtos novos
  const newProducts = mockProducts.filter((product) => product.isNew).slice(0, 8)

  // Produtos em liquidação (com maiores descontos)
  const liquidacaoProducts = [...productsWithDiscount]
    .sort((a, b) => (b.oldPrice! - b.price) / b.oldPrice! - (a.oldPrice! - a.price) / a.oldPrice!)
    .slice(0, 8)

  // Produtos novos em promoção
  const newPromoProducts = productsWithDiscount.filter((product) => product.isNew).slice(0, 8)

  // Últimas unidades
  const lastUnitsProducts = productsWithDiscount
    .filter((product) => product.inventory < 10 && product.inventory > 0)
    .slice(0, 8)

  return (
    <div className="container py-8">
      {/* Banner de Promoções */}
      <PromoBanner />

      {/* Carrossel de produtos novos */}
      <div className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
            Produtos Novos
          </h2>
          <Link href="/produtos?novidades=true" className="text-red-600 hover:text-red-700 flex items-center">
            Ver todos
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {newProducts.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0 mr-2" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>

      {/* Carrossel de produtos em promoção */}
      <div className="my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <Fire className="mr-2 h-5 w-5 text-red-500" />
            Ofertas Imperdíveis
          </h2>
          <Link href="/produtos?promocao=true" className="text-red-600 hover:text-red-700 flex items-center">
            Ver todas
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {liquidacaoProducts.map((product) => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious className="static translate-y-0 mr-2" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="my-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Todas as Promoções</h2>

        <div className="flex flex-1 max-w-md gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar em promoções" className="pl-9" />
          </div>
          <Button className="bg-red-600 hover:bg-red-700">Buscar</Button>
        </div>
      </div>

      {/* Categorias de promoções */}
      <Tabs defaultValue="todas" className="mb-8">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="semana">Ofertas da Semana</TabsTrigger>
          <TabsTrigger value="liquidacao">Liquidação</TabsTrigger>
          <TabsTrigger value="ultimas-unidades">Últimas Unidades</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsWithDiscount.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="semana" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newPromoProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="liquidacao" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {liquidacaoProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ultimas-unidades" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lastUnitsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Destaques de promoções em flex */}
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6">Categorias em Promoção</h2>
        <div className="flex flex-wrap gap-4">
          <Card className="group relative overflow-hidden h-64 flex-1 min-w-[280px]">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-90"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
              <Percent className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Até 50% OFF</h3>
              <p className="mb-4">Em roupas masculinas selecionadas</p>
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                <Link href="/produtos?categoria=masculino">Ver Ofertas</Link>
              </Button>
            </div>
          </Card>

          <Card className="group relative overflow-hidden h-64 flex-1 min-w-[280px]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-90"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
              <Tag className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Compre 2, Leve 3</h3>
              <p className="mb-4">Em acessórios para treino</p>
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                <Link href="/produtos?categoria=acessorios">Ver Ofertas</Link>
              </Button>
            </div>
          </Card>

          <Card className="group relative overflow-hidden h-64 flex-1 min-w-[280px]">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 opacity-90"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
              <Clock className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-bold mb-2">Oferta Relâmpago</h3>
              <p className="mb-4">Apenas hoje: 30% OFF em leggings</p>
              <Button variant="outline" className="text-white border-white hover:bg-white/20">
                <Link href="/produtos?categoria=feminino">Ver Ofertas</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Cupom de desconto */}
      <div className="my-12 bg-gray-100 rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Cupom de Desconto Exclusivo</h2>
            <p className="text-muted-foreground">Use o código abaixo e ganhe 10% OFF em qualquer compra</p>
          </div>
          <div className="bg-white border-2 border-dashed border-red-600 rounded-md px-6 py-3">
            <span className="text-xl font-bold text-red-600">POWER10</span>
          </div>
          <Button className="bg-red-600 hover:bg-red-700">
            <Link href="/produtos">Comprar Agora</Link>
          </Button>
        </div>
      </div>

      {/* Inscrição para promoções */}
      <PromoSubscribe />
    </div>
  )
}
