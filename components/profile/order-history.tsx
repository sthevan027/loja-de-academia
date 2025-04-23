"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Eye } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Dados simulados de pedidos
const mockOrders = [
  {
    id: "ORD001",
    date: "2023-11-15T10:30:00",
    status: "Entregue",
    paymentMethod: "Cartão de Crédito",
    items: [
      {
        id: "1",
        name: "Camiseta Dry-Fit Performance",
        price: 89.9,
        quantity: 2,
      },
      {
        id: "5",
        name: "Luvas de Treino Premium",
        price: 79.9,
        quantity: 1,
      },
    ],
    subtotal: 259.7,
    shipping: 15,
    discount: 0,
    total: 274.7,
  },
  {
    id: "ORD002",
    date: "2023-11-10T14:45:00",
    status: "Enviado",
    paymentMethod: "PIX",
    items: [
      {
        id: "2",
        name: "Legging Compressão Feminina",
        price: 129.9,
        quantity: 1,
      },
      {
        id: "7",
        name: "Top Esportivo Support",
        price: 79.9,
        quantity: 2,
      },
    ],
    subtotal: 289.7,
    shipping: 15,
    discount: 28.97,
    total: 275.73,
  },
]

interface OrderHistoryProps {
  userId: string
}

export default function OrderHistory({ userId }: OrderHistoryProps) {
  const [orders, setOrders] = useState(mockOrders)
  const [isLoading, setIsLoading] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Carregar pedidos do usuário
  useEffect(() => {
    // Aqui você faria uma chamada API para buscar os pedidos do usuário
    // Por enquanto, estamos usando dados simulados
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [userId])

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "processando":
        return "bg-blue-100 text-blue-800"
      case "enviado":
        return "bg-purple-100 text-purple-800"
      case "entregue":
        return "bg-green-100 text-green-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading && orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Pedidos</CardTitle>
          <CardDescription>Histórico de todos os seus pedidos</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Pedidos</CardTitle>
        <CardDescription>Histórico de todos os seus pedidos</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Você ainda não realizou nenhum pedido.</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <a href="/produtos">Explorar Produtos</a>
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentOrder(order)
                          setIsViewDialogOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{currentOrder?.id}</DialogTitle>
            <DialogDescription>Informações completas sobre o pedido.</DialogDescription>
          </DialogHeader>
          {currentOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Informações do Pedido</h3>
                  <p className="text-sm">Data: {new Date(currentOrder.date).toLocaleDateString("pt-BR")}</p>
                  <p className="text-sm">Status: {currentOrder.status}</p>
                  <p className="text-sm">Pagamento: {currentOrder.paymentMethod}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Itens do Pedido</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentOrder.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(currentOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span>{formatCurrency(currentOrder.shipping)}</span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Desconto:</span>
                    <span>-{formatCurrency(currentOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(currentOrder.total)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
