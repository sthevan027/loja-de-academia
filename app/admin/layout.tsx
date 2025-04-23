import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Painel de Administração</h1>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/">Voltar para o Site</Link>
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full justify-start overflow-auto">
            <TabsTrigger value="dashboard" asChild>
              <Link href="/admin">Dashboard</Link>
            </TabsTrigger>
            <TabsTrigger value="products" asChild>
              <Link href="/admin/produtos">Produtos</Link>
            </TabsTrigger>
            <TabsTrigger value="orders" asChild>
              <Link href="/admin/pedidos">Pedidos</Link>
            </TabsTrigger>
            <TabsTrigger value="promotions" asChild>
              <Link href="/admin/promocoes">Promoções</Link>
            </TabsTrigger>
            <TabsTrigger value="filters" asChild>
              <Link href="/admin/filtros">Filtros</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div>{children}</div>
      </div>
    </div>
  )
}
