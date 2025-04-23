"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { formatCurrency } from "@/lib/utils"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const shipping = cartItems.length > 0 ? 15 : 0
  const total = subtotal + shipping - discount

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "POWER10") {
      const discountAmount = subtotal * 0.1
      setDiscount(discountAmount)
      toast({
        title: "Cupom aplicado",
        description: `Desconto de ${formatCurrency(discountAmount)} aplicado ao seu pedido.`,
      })
    } else {
      toast({
        title: "Cupom inválido",
        description: "O código de cupom informado não é válido.",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Faça login para continuar",
        description: "Você precisa estar logado para finalizar a compra.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      })
      return
    }

    // Simulate successful checkout
    toast({
      title: "Pedido realizado com sucesso!",
      description: "Seu pedido foi processado e será enviado em breve.",
    })

    clearCart()
    router.push("/pedidos")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Seu Carrinho</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Itens do Carrinho ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${item.selectedSize || index}`}
                    className="flex flex-col sm:flex-row gap-4 py-4 border-b"
                  >
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg?height=400&width=300"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>

                    <div className="flex-grow">
                      <Link href={`/produtos/${item.id}`} className="font-medium text-lg hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.category}</p>

                      {/* Exibir o tamanho selecionado */}
                      {item.selectedSize && (
                        <p className="text-sm mt-1">
                          <span className="font-medium">Tamanho:</span> {item.selectedSize}
                        </p>
                      )}

                      <div className="flex flex-wrap justify-between items-center mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-muted-foreground">{formatCurrency(item.price)} cada</div>
                            )}
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/produtos">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continuar Comprando
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>{shipping > 0 ? formatCurrency(shipping) : "Grátis"}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <div className="pt-4">
                  <Label htmlFor="coupon">Cupom de Desconto</Label>
                  <div className="flex mt-1.5 gap-2">
                    <Input
                      id="coupon"
                      placeholder="POWER10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleApplyCoupon}>
                      Aplicar
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleCheckout}>
                  Finalizar Compra
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-4 text-sm text-muted-foreground">
              <p className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Compra segura garantida
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Seu carrinho está vazio</h2>
          <p className="text-muted-foreground mb-6">
            Parece que você ainda não adicionou nenhum produto ao seu carrinho.
          </p>
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/produtos">Explorar Produtos</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
