"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function OrderConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)

  const status = searchParams.get("status")
  const orderId = searchParams.get("order_id")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (orderId) {
      fetchOrderDetails()
    } else {
      setIsLoading(false)
    }
  }, [user, authLoading, orderId])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>Carregando informações do pedido...</p>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="container py-8">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Pedido não encontrado</CardTitle>
            <CardDescription>Não foi possível encontrar as informações do pedido.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Verifique se o link está correto ou acesse seus pedidos para mais detalhes.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/pedidos">Ver Meus Pedidos</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          {status === "success" ? (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle>Pagamento Confirmado!</CardTitle>
              <CardDescription>Seu pedido foi processado com sucesso.</CardDescription>
            </>
          ) : status === "pending" ? (
            <>
              <div className="flex justify-center mb-4">
                <Clock className="h-16 w-16 text-yellow-500" />
              </div>
              <CardTitle>Pagamento Pendente</CardTitle>
              <CardDescription>Estamos aguardando a confirmação do seu pagamento.</CardDescription>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <CardTitle>Pagamento não Concluído</CardTitle>
              <CardDescription>Houve um problema ao processar seu pagamento.</CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Número do Pedido:</p>
            <p className="text-lg">{orderId}</p>
          </div>

          {order && (
            <>
              <div>
                <p className="font-medium">Status do Pedido:</p>
                <p>{order.status}</p>
              </div>

              <div>
                <p className="font-medium">Data do Pedido:</p>
                <p>{new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
              </div>

              <div>
                <p className="font-medium">Método de Pagamento:</p>
                <p>{order.payment_method}</p>
              </div>
            </>
          )}

          {status === "pending" && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm">
                Seu pagamento está sendo processado. Assim que confirmado, você receberá uma notificação por email.
              </p>
            </div>
          )}

          {status === "failure" && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-sm">
                Houve um problema ao processar seu pagamento. Por favor, tente novamente ou entre em contato com nosso
                suporte.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
            <Link href="/pedidos">Ver Meus Pedidos</Link>
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/produtos">
              Continuar Comprando
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
