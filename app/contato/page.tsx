"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail, MapPin, Phone } from "lucide-react"

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  subject: z.string().min(5, { message: "O assunto deve ter pelo menos 5 caracteres" }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres" }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Erro ao enviar mensagem")
      }

      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso. Entraremos em contato em breve.",
      })

      form.reset()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Entre em Contato</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Informações de Contato */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Informações de Contato</h2>
            <p className="text-muted-foreground mb-8">
              Estamos sempre prontos para atender você. Entre em contato conosco para tirar dúvidas, fazer sugestões ou
              reclamações.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-red-600 p-3 rounded-full mr-4">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">contato@powerfit.com</p>
                  <p className="text-sm text-muted-foreground mt-1">Envie suas dúvidas, reclamações ou solicitações</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-600 p-3 rounded-full mr-4">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Telefone</h3>
                  <p className="text-muted-foreground">(11) 9999-9999</p>
                  <p className="text-sm text-muted-foreground mt-1">Segunda a Sexta, das 9h às 18h</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-600 p-3 rounded-full mr-4">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Endereço</h3>
                  <p className="text-muted-foreground">Av. Paulista, 1000 - Bela Vista</p>
                  <p className="text-muted-foreground">São Paulo - SP, 01310-100</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">Horário de Atendimento</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Segunda a Sexta</span>
                <span>9h às 18h</span>
              </div>
              <div className="flex justify-between">
                <span>Sábado</span>
                <span>9h às 13h</span>
              </div>
              <div className="flex justify-between">
                <span>Domingo e Feriados</span>
                <span>Fechado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Contato */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Envie uma Mensagem</h2>
              <p className="text-muted-foreground mb-6">
                Preencha o formulário abaixo para enviar uma mensagem diretamente para nossa equipe. Responderemos o
                mais breve possível.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto</FormLabel>
                        <FormControl>
                          <Input placeholder="Assunto da mensagem" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Digite sua mensagem aqui..." rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar Mensagem"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mapa */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Nossa Localização</h2>
        <div className="w-full h-96 bg-muted rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0976951333184!2d-46.65390508502264!3d-23.563273284682373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1650000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Perguntas Frequentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium">Qual o prazo de entrega?</h3>
            <p className="text-muted-foreground">
              O prazo de entrega varia de acordo com a sua localização, mas geralmente é de 3 a 7 dias úteis após a
              confirmação do pagamento.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Como posso rastrear meu pedido?</h3>
            <p className="text-muted-foreground">
              Após o envio do pedido, você receberá um e-mail com o código de rastreamento. Você também pode acompanhar
              o status do pedido na área "Meus Pedidos" do seu perfil.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Qual a política de troca e devolução?</h3>
            <p className="text-muted-foreground">
              Você pode solicitar a troca ou devolução em até 7 dias após o recebimento do produto. O produto deve estar
              em perfeito estado, sem sinais de uso e com a etiqueta original.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Quais formas de pagamento são aceitas?</h3>
            <p className="text-muted-foreground">
              Aceitamos cartões de crédito, boleto bancário, PIX e transferência bancária.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
