"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import AdminProducts from "@/components/admin/admin-products"
import AdminOrders from "@/components/admin/admin-orders"
import AdminPromotions from "@/components/admin/admin-promotions"
import AdminDashboard from "@/components/admin/admin-dashboard"
import AdminFilters from "@/components/admin/admin-filters"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user || !user.isAdmin) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      <Tabs defaultValue="dashboard">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="promotions">Promoções</TabsTrigger>
          <TabsTrigger value="filters">Filtros</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AdminDashboard />
        </TabsContent>

        <TabsContent value="products">
          <AdminProducts />
        </TabsContent>

        <TabsContent value="orders">
          <AdminOrders />
        </TabsContent>

        <TabsContent value="promotions">
          <AdminPromotions />
        </TabsContent>

        <TabsContent value="filters">
          <AdminFilters />
        </TabsContent>
      </Tabs>
    </div>
  )
}
