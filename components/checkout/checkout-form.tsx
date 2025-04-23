"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, Landmark, QrCode } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { formatCurrency } from "@/lib/utils"

const checkoutSchema = z.object({
  addressId: z.string({
    required_error: "Selecione um endereço de entrega",
  }),
  paymentMethod: z.enum(["credit_card", "pix", "boleto"], {
    required_error: "Selecione um método de pagamento",
  }),
})

type CheckoutFormValues = z.infer<typeof checkoutSchema>

export default function CheckoutForm() {
  const { cartItems, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [addresses, setAddresses] = useState<any[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const shipping = cartItems.length > 0 ? 15 : 0
  const total = subtotal + shipping - discount

  useEffect(() => {
    if (user) {
      fetchAddresses()
    }
  }, [user])

  const fetchAddresses = async () => {
    setIsLoadingAddresses(true)
    try {
      const response = await fetch(`/api/user/addresses?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)

        const defaultAddress = data.find((addr: any) => addr.is_default)
        if (defaultAddress && form) {
          form.setValue("addressId", defaultAddress.id.toString())
        }
      }
    } catch (error) {
      console.error("Erro ao buscar endereços:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus endereços.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAddresses(false)
    }
  }

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "credit_card",
    },
  })

  const handleApplyCoupon = async (code: string) => {
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code || couponCode,
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
    }
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione produtos ao carrinho antes de finalizar a compra.",
        variant: "destructive",
      })
      return
    }

    setIsProcessingPayment(true)

    try {
      const items = cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }))

      const response = await fetch("/api/checkout/mercadopago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          addressId: data.addressId,
          items,
          shipping,
          discount,
          paymentMethod: data.paymentMethod,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao processar pagamento")
      }

      const result = await response.json()
      const isDevelopment = process.env.NODE_ENV === "development"
      const redirectUrl = isDevelopment ? result.sandboxInitPoint : result.initPoint

      clearCart()
      window.location.href = redirectUrl
    } catch (error) {
      console.error("Erro no checkout:", error)
      toast({
        title: "Erro no processamento",
        description: "Ocorreu um erro ao processar seu pagamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Endereço de Entrega */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço de Entrega</CardTitle>
            <CardDescription>Selecione o endereço para entrega dos produtos</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAddresses ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-red-600" />
              </div>
            ) : addresses.length > 0 ? (
              <FormField
                control={form.control}
                name="addressId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`flex items-start space-x-3 border rounded-lg p-4 ${
                              field.value === address.id.toString()
                                ? "border-red-600 bg-red-50"
                                : "border-gray-200"
                            }`}
                          >
                            <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                            <div className="flex-1">
                              <label htmlFor={`address-${address.id}`} className="font-medium cursor-pointer">
                                {address.street}, {address.number}
                                {address.is_default && (
                                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                    Padrão
                                  </span>
                                )}
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {address.complement && `${address.complement}, `}
                                {address.neighborhood} - {address.city}/{address.state}
                              </p>
                              <p className="text-sm text-muted-foreground">CEP: {address.zip_code}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground mb-4">Você ainda não possui endereços cadastrados.</p>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => router.push("/perfil?tab=addresses")}
                >
                  Adicionar Endereço
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Método de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Método de Pagamento</CardTitle>
            <CardDescription>Selecione como deseja pagar</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                      <div
                        className={`flex items-start space-x-3 border rounded-lg p-4 ${
                          field.value === "credit_card" ? "border-red-600 bg-red-50" : "border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value="credit_card" id="payment-credit-card" />
                        <div className="flex-1">
                          <label htmlFor="payment-credit-card" className="flex items-center font-medium cursor-pointer">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Cartão de Crédito
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Pague em até 12x com juros via Mercado Pago
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-start space-x-3 border rounded-lg p-4 ${
                          field.value === "pix" ? "border-red-600 bg-red-50" : "border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value="pix" id="payment-pix" />
                        <div className="flex-1">
                          <label htmlFor="payment-pix" className="flex items-center font-medium cursor-pointer">
                            <QrCode className="mr-2 h-4 w-4" />
                            PIX
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Pagamento instantâneo com aprovação imediata
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex items-start space-x-3 border rounded-lg p-4 ${
                          field.value === "boleto" ? "border-red-600 bg-red-50" : "border-gray-200"
                        }`}
                      >
                        <RadioGroupItem value="boleto" id="payment-boleto" />
                        <div className="flex-1">
                          <label htmlFor="payment-boleto" className="flex items-center font-medium cursor-pointer">
                            <Landmark className="mr-2 h-4 w-4" />
                            Boleto Bancário
                          </label>
                          <p className="text-sm text-muted-foreground">
                            O pedido será enviado após a confirmação do pagamento (1-3 dias úteis)
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Resumo do Pedido (Mobile) */}
        <div className="lg:hidden">
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
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isProcessingPayment}>
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
        </div>
      </form>
    </Form>
  )
} 