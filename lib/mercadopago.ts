import { MercadoPagoConfig, Payment, Preference } from "mercadopago"

// Configuração do cliente Mercado Pago
const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
})

// Função para criar uma preferência de pagamento
export async function createPaymentPreference(
  items: Array<{
    id: string | number
    title: string
    quantity: number
    unit_price: number
    currency_id?: string
    picture_url?: string
  }>,
  payer: {
    name: string
    email: string
    phone?: {
      area_code?: string
      number?: string
    }
    address?: {
      street_name?: string
      street_number?: number
      zip_code?: string
    }
  },
  backUrls: {
    success: string
    failure: string
    pending: string
  },
  externalReference: string,
  notificationUrl?: string,
) {
  try {
    const preference = new Preference(mercadoPagoClient)

    const preferenceData = {
      items,
      payer,
      back_urls: backUrls,
      external_reference: externalReference,
      notification_url: notificationUrl,
      auto_return: "approved",
    }

    const result = await preference.create({ body: preferenceData })
    return result
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error)
    throw error
  }
}

// Função para verificar o status de um pagamento
export async function getPaymentStatus(paymentId: string) {
  try {
    const payment = new Payment(mercadoPagoClient)
    const result = await payment.get({ id: paymentId })
    return result
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error)
    throw error
  }
}

// Função para processar notificações de pagamento (webhooks)
export async function processPaymentWebhook(data: any) {
  try {
    // Verificar o tipo de notificação
    if (data.type === "payment") {
      const paymentId = data.data.id
      const paymentInfo = await getPaymentStatus(paymentId)

      // Retornar as informações do pagamento para atualizar o pedido
      return {
        paymentId,
        status: paymentInfo.status,
        externalReference: paymentInfo.external_reference,
        transactionAmount: paymentInfo.transaction_amount,
        dateCreated: paymentInfo.date_created,
        dateApproved: paymentInfo.date_approved,
      }
    }

    return null
  } catch (error) {
    console.error("Erro ao processar webhook de pagamento:", error)
    throw error
  }
}
