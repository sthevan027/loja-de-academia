import { type NextRequest, NextResponse } from "next/server"
import { processPaymentWebhook } from "@/lib/mercadopago"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Processar a notificação do webhook
    const paymentInfo = await processPaymentWebhook(data)

    if (!paymentInfo) {
      return NextResponse.json({ message: "Notificação recebida, mas não processada" })
    }

    // Extrair o ID do pedido do external_reference (formato: order_123)
    const orderId = paymentInfo.externalReference.replace("order_", "")

    // Mapear o status do Mercado Pago para o status do nosso sistema
    let orderStatus
    switch (paymentInfo.status) {
      case "approved":
        orderStatus = "paid"
        break
      case "pending":
      case "in_process":
        orderStatus = "pending"
        break
      case "rejected":
        orderStatus = "cancelled"
        break
      default:
        orderStatus = "pending"
    }

    // Atualizar o status do pedido no banco de dados
    await query(`UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, [orderStatus, orderId])

    // Registrar a transação de pagamento
    await query(
      `INSERT INTO payment_transactions (
        order_id, payment_id, status, amount, provider, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, paymentInfo.paymentId, paymentInfo.status, paymentInfo.transactionAmount, "Mercado Pago", new Date()],
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao processar webhook:", error)
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 })
  }
}
