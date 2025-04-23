"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Mail, CheckCircle2 } from "lucide-react"

export default function PromoSubscribe() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simular uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubscribed(true)
    setEmail("")

    toast({
      title: "Inscrição realizada!",
      description: "Você receberá nossas promoções por email.",
    })
  }

  return (
    <div className="bg-gray-900 rounded-lg p-8 text-white">
      <div className="max-w-3xl mx-auto text-center">
        {!isSubscribed ? (
          <>
            <h2 className="text-2xl font-bold mb-2">Receba Nossas Promoções</h2>
            <p className="text-gray-300 mb-6">
              Inscreva-se para receber ofertas exclusivas, novidades e descontos especiais diretamente no seu email.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                {isSubmitting ? "Inscrevendo..." : "Inscrever-se"}
              </Button>
            </form>

            <p className="text-xs text-gray-400 mt-4">
              Ao se inscrever, você concorda em receber emails promocionais. Você pode cancelar a qualquer momento.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Inscrição Confirmada!</h2>
            <p className="text-gray-300">Obrigado por se inscrever! Você receberá nossas melhores ofertas em breve.</p>
            <Button
              variant="link"
              className="text-red-400 hover:text-red-300 mt-4"
              onClick={() => setIsSubscribed(false)}
            >
              Inscrever outro email
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
