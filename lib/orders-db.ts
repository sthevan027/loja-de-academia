import { query } from "./db"

export type Order = {
  id: number
  user_id: number
  status: string
  payment_method: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  address_id: number
  created_at: Date
  updated_at: Date
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
}

export async function createOrder(
  userId: number,
  addressId: number,
  items: { productId: number; quantity: number; price: number }[],
  paymentMethod: string,
  subtotal: number,
  shipping: number,
  discount: number,
  total: number,
): Promise<Order | null> {
  try {
    // Iniciar transação
    await query("BEGIN")

    // Criar o pedido
    const orderSql = `
      INSERT INTO orders (user_id, address_id, payment_method, subtotal, shipping, discount, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `

    const orderResult = await query(orderSql, [userId, addressId, paymentMethod, subtotal, shipping, discount, total])

    const order = orderResult.rows[0] as Order

    // Inserir os itens do pedido
    for (const item of items) {
      const itemSql = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `

      await query(itemSql, [order.id, item.productId, item.quantity, item.price])

      // Atualizar o estoque do produto
      await query("UPDATE products SET inventory = inventory - $1 WHERE id = $2", [item.quantity, item.productId])
    }

    // Finalizar transação
    await query("COMMIT")

    return order
  } catch (error) {
    // Reverter transação em caso de erro
    await query("ROLLBACK")
    console.error("Erro ao criar pedido:", error)
    return null
  }
}

export async function getOrdersByUserId(userId: number): Promise<Order[]> {
  try {
    const sql = `
      SELECT * FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `

    const result = await query(sql, [userId])
    return result.rows as Order[]
  } catch (error) {
    console.error("Erro ao buscar pedidos do usuário:", error)
    return []
  }
}

export async function getOrderById(id: number): Promise<Order | null> {
  try {
    const sql = `SELECT * FROM orders WHERE id = $1`
    const result = await query(sql, [id])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Order
  } catch (error) {
    console.error("Erro ao buscar pedido por ID:", error)
    return null
  }
}

export async function getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
  try {
    const sql = `
      SELECT oi.*, p.name as product_name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
    `

    const result = await query(sql, [orderId])
    return result.rows as OrderItem[]
  } catch (error) {
    console.error("Erro ao buscar itens do pedido:", error)
    return []
  }
}

export async function updateOrderStatus(id: number, status: string): Promise<boolean> {
  try {
    const sql = `
      UPDATE orders
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `

    await query(sql, [status, id])
    return true
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    return false
  }
}
