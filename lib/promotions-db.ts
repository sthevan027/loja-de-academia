import { query } from "./db"

export type Promotion = {
  id: number
  name: string
  code: string
  discount_type: string
  discount_value: number
  start_date: Date
  end_date: Date
  is_active: boolean
  min_purchase: number
}

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const sql = `SELECT * FROM promotions ORDER BY created_at DESC`
    const result = await query(sql)
    return result.rows as Promotion[]
  } catch (error) {
    console.error("Erro ao buscar promoções:", error)
    return []
  }
}

export async function getPromotionByCode(code: string): Promise<Promotion | null> {
  try {
    const sql = `
      SELECT * FROM promotions
      WHERE code = $1
        AND is_active = true
        AND start_date <= CURRENT_TIMESTAMP
        AND end_date >= CURRENT_TIMESTAMP
    `

    const result = await query(sql, [code])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Promotion
  } catch (error) {
    console.error("Erro ao buscar promoção por código:", error)
    return null
  }
}

export async function applyPromotion(
  code: string,
  subtotal: number,
): Promise<{ discount: number; message: string } | null> {
  try {
    const promotion = await getPromotionByCode(code)

    if (!promotion) {
      return { discount: 0, message: "Código de promoção inválido ou expirado." }
    }

    if (subtotal < promotion.min_purchase) {
      return {
        discount: 0,
        message: `Valor mínimo de compra não atingido. Mínimo: R$ ${promotion.min_purchase.toFixed(2)}`,
      }
    }

    let discount = 0

    if (promotion.discount_type === "percentage") {
      discount = (subtotal * promotion.discount_value) / 100
    } else {
      discount = promotion.discount_value
    }

    return {
      discount,
      message: `Desconto de ${
        promotion.discount_type === "percentage"
          ? `${promotion.discount_value}%`
          : `R$ ${promotion.discount_value.toFixed(2)}`
      } aplicado com sucesso!`,
    }
  } catch (error) {
    console.error("Erro ao aplicar promoção:", error)
    return null
  }
}
