import { type NextRequest, NextResponse } from "next/server"
import { createPaymentPreference } from "@/lib/mercadopago"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar os dados necessários
    if (!data.userId || !data.items || !data.addressId) {
      return NextResponse.json({ error: "Dados incompletos para checkout" }, { status: 400 })
    }

    // Buscar informações do usuário
    const userQuery = `
      SELECT name, email, phone FROM users WHERE id = $1
    `
    const userResult = await query(userQuery, [data.userId])

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const user = userResult.rows[0]

    // Buscar informações do endereço
    const addressQuery = `
      SELECT street as street_name, number as street_number, zip_code
      FROM addresses WHERE id = $1 AND user_id = $2
    `
    const addressResult = await query(addressQuery, [data.addressId, data.userId])

    if (addressResult.rows.length === 0) {
      return NextResponse.json({ error: "Endereço não encontrado" }, { status: 404 })
    }

    const address = addressResult.rows[0]

    // Buscar informações dos produtos
    const productIds = data.items.map((item: any) => item.id)
    const productsQuery = `
      SELECT id, name, price, image_url FROM products WHERE id = ANY($1)
    `
    const productsResult = await query(productsQuery, [productIds])

    const productsMap = new Map()
    productsResult.rows.forEach((product: any) => {
      productsMap.set(product.id, product)
    })

    // Criar pedido no banco de dados
    const orderQuery = `
      INSERT INTO orders (
        user_id, address_id, status, payment_method, subtotal, shipping, discount, total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `

    const subtotal = data.items.reduce((acc: number, item: any) => {
      const product = productsMap.get(item.id)
      return acc + (product ? product.price * item.quantity : 0)
    }, 0)

    const shipping = data.shipping || 0
    const discount = data.discount || 0
    const total = subtotal + shipping - discount

    const orderResult = await query(orderQuery, [
      data.userId,
      data.addressId,
      "pending",
      "Mercado Pago",
      subtotal,
      shipping,
      discount,
      total,
    ])

    const orderId = orderResult.rows[0].id

    // Inserir itens do pedido
    for (const item of data.items) {
      const product = productsMap.get(item.id)
      if (product) {
        await query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.id, item.quantity, product.price],
        )
      }
    }

    // Preparar itens para o Mercado Pago
    const mpItems = data.items.map((item: any) => {
      const product = productsMap.get(item.id)
      return {
        id: item.id,
        title: product.name,
        quantity: item.quantity,
        unit_price: Number.parseFloat(product.price),
        currency_id: "BRL",
        picture_url: product.image_url || undefined,
      }
    })

    // Criar preferência de pagamento no Mercado Pago
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    const preference = await createPaymentPreference(
      mpItems,
      {
        name: user.name,
        email: user.email,
        phone: user.phone ? { number: user.phone } : undefined,
        address: {
          street_name: address.street_name,
          street_number: Number.parseInt(address.street_number),
          zip_code: address.zip_code,
        },
      },
      {
        success: `${baseUrl}/pedidos/confirmacao?status=success&order_id=${orderId}`,
        failure: `${baseUrl}/pedidos/confirmacao?status=failure&order_id=${orderId}`,
        pending: `${baseUrl}/pedidos/confirmacao?status=pending&order_id=${orderId}`,
      },
      `order_${orderId}`,
      `${baseUrl}/api/webhooks/mercadopago`,
    )

    return NextResponse.json({
      orderId,
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    })
  } catch (error) {
    console.error("Erro ao processar checkout:", error)
    return NextResponse.json({ error: "Erro ao processar checkout" }, { status: 500 })
  }
}
