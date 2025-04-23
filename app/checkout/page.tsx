import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import CheckoutForm from "@/components/checkout/checkout-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CreditCard, Truck, Lock } from "lucide-react"

export const metadata: Metadata = {
  title: "Finalizar Compra",
  description: "Finalize sua compra de forma segura e rápida",
}

const benefits = [
  {
    title: "Pagamento Seguro",
    description: "Processamento de pagamento 100% seguro",
    icon: Shield,
  },
  {
    title: "Diversas Formas de Pagamento",
    description: "Aceitamos cartões, PIX e boleto",
    icon: CreditCard,
  },
  {
    title: "Entrega Rápida",
    description: "Entrega em todo o Brasil",
    icon: Truck,
  },
  {
    title: "Dados Protegidos",
    description: "Seus dados estão sempre seguros",
    icon: Lock,
  },
]

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/checkout")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Benefícios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon
                  return (
                    <div key={benefit.title} className="flex items-start gap-3">
                      <Icon className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Políticas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Entrega em até 7 dias úteis</li>
                <li>• Garantia de 30 dias</li>
                <li>• Devolução gratuita</li>
                <li>• Suporte 24/7</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
