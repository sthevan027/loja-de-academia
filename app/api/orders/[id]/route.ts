import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Buscar informações do pedido
    const orderQuery = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `
    const orderResult = await query(orderQuery, [orderId])

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    const order = orderResult.rows[0]

    // Buscar itens do pedido
    const itemsQuery = `
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `
    const itemsResult = await query(itemsQuery, [orderId])

    // Buscar endereço de entrega
    const addressQuery = `
      SELECT *
      FROM addresses
      WHERE id = $1
    `
    const addressResult = await query(addressQuery, [order.address_id])

    // Buscar transações de pagamento
    const transactionsQuery = `
      SELECT *
      FROM payment_transactions
      WHERE order_id = $1
      ORDER BY created_at DESC
    `
    const transactionsResult = await query(transactionsQuery, [orderId])

    return NextResponse.json({
      ...order,
      items: itemsResult.rows,
      address: addressResult.rows[0] || null,
      transactions: transactionsResult.rows,
    })
  } catch (error) {
    console.error("Erro ao buscar detalhes do pedido:", error)
    return NextResponse.json({ error: "Erro ao buscar detalhes do pedido" }, { status: 500 })
  }
}
