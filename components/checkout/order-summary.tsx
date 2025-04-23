"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Tag } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

interface OrderSummaryProps {
  onSubmit: () => void
  isProcessingPayment: boolean
  discount: number
  setDiscount: (value: number) => void
}

export default function OrderSummary({
  onSubmit,
  isProcessingPayment,
  discount,
  setDiscount,
}: OrderSummaryProps) {
  const { cartItems, subtotal } = useCart()
  const { toast } = useToast()
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const shipping = cartItems.length > 0 ? 15 : 0
  const total = subtotal + shipping - discount

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Cupom inválido",
        description: "Digite um código de cupom válido.",
        variant: "destructive",
      })
      return
    }

    setIsApplyingCoupon(true)

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          subtotal,
        }),
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setDiscount(data.discount)
        toast({
          title: "Cupom aplicado",
          description: `Desconto de ${formatCurrency(data.discount)} aplicado ao seu pedido.`,
        })
      } else {
        toast({
          title: "Cupom inválido",
          description: data.message || "O código de cupom informado não é válido.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao aplicar cupom:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao aplicar o cupom.",
        variant: "destructive",
      })
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  return (
    <Card className="sticky top-4 h-fit">
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
        <CardDescription>Revise os detalhes do seu pedido</CardDescription>
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

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Código do cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApplyCoupon}
              disabled={isApplyingCoupon}
            >
              {isApplyingCoupon ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Tag className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={onSubmit}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            "Finalizar Compra"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 