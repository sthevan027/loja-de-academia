"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import ProfileInfo from "@/components/profile/profile-info"
import AddressManager from "@/components/profile/address-manager"
import OrderHistory from "@/components/profile/order-history"
import PasswordChange from "@/components/profile/password-change"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("info")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Redirecionando para login
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar com informações do usuário */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Olá, {user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-1">
                <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                  <TabsTrigger
                    value="info"
                    onClick={() => setActiveTab("info")}
                    className={`justify-start px-3 ${
                      activeTab === "info" ? "bg-red-600 text-white hover:bg-red-700" : "hover:bg-muted"
                    }`}
                  >
                    Informações Pessoais
                  </TabsTrigger>
                  <TabsTrigger
                    value="addresses"
                    onClick={() => setActiveTab("addresses")}
                    className={`justify-start px-3 ${
                      activeTab === "addresses" ? "bg-red-600 text-white hover:bg-red-700" : "hover:bg-muted"
                    }`}
                  >
                    Endereços
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    onClick={() => setActiveTab("orders")}
                    className={`justify-start px-3 ${
                      activeTab === "orders" ? "bg-red-600 text-white hover:bg-red-700" : "hover:bg-muted"
                    }`}
                  >
                    Meus Pedidos
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    onClick={() => setActiveTab("password")}
                    className={`justify-start px-3 ${
                      activeTab === "password" ? "bg-red-600 text-white hover:bg-red-700" : "hover:bg-muted"
                    }`}
                  >
                    Alterar Senha
                  </TabsTrigger>
                </TabsList>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo principal */}
        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="info">
              <ProfileInfo user={user} />
            </TabsContent>
            <TabsContent value="addresses">
              <AddressManager userId={user.id} />
            </TabsContent>
            <TabsContent value="orders">
              <OrderHistory userId={user.id} />
            </TabsContent>
            <TabsContent value="password">
              <PasswordChange userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
