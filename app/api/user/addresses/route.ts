import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/user/addresses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const sql = `
      SELECT * FROM addresses
      WHERE user_id = $1
      ORDER BY is_default DESC, created_at DESC
    `

    const result = await query(sql, [userId])
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erro ao buscar endereços:", error)
    return NextResponse.json({ error: "Erro ao buscar endereços" }, { status: 500 })
  }
}

// POST /api/user/addresses
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar os dados
    if (!data.userId || !data.street || !data.number || !data.city || !data.state || !data.zipCode) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Se for endereço padrão, atualizar os outros endereços
    if (data.isDefault) {
      await query("UPDATE addresses SET is_default = false WHERE user_id = $1", [data.userId])
    }

    const sql = `
      INSERT INTO addresses (
        user_id, street, number, complement, neighborhood, city, state, zip_code, is_default
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `

    const result = await query(sql, [
      data.userId,
      data.street,
      data.number,
      data.complement || "",
      data.neighborhood,
      data.city,
      data.state,
      data.zipCode,
      data.isDefault || false,
    ])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao criar endereço:", error)
    return NextResponse.json({ error: "Erro ao criar endereço" }, { status: 500 })
  }
}

// PUT /api/user/addresses
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do endereço é obrigatório" }, { status: 400 })
    }

    const data = await request.json()

    // Se for endereço padrão, atualizar os outros endereços
    if (data.isDefault) {
      await query("UPDATE addresses SET is_default = false WHERE user_id = $1", [data.userId])
    }

    const sql = `
      UPDATE addresses
      SET street = $1, number = $2, complement = $3, neighborhood = $4,
          city = $5, state = $6, zip_code = $7, is_default = $8
      WHERE id = $9
      RETURNING *
    `

    const result = await query(sql, [
      data.street,
      data.number,
      data.complement || "",
      data.neighborhood,
      data.city,
      data.state,
      data.zipCode,
      data.isDefault || false,
      id,
    ])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Endereço não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Erro ao atualizar endereço:", error)
    return NextResponse.json({ error: "Erro ao atualizar endereço" }, { status: 500 })
  }
}

// DELETE /api/user/addresses
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do endereço é obrigatório" }, { status: 400 })
    }

    const sql = "DELETE FROM addresses WHERE id = $1 RETURNING id"
    const result = await query(sql, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Endereço não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir endereço:", error)
    return NextResponse.json({ error: "Erro ao excluir endereço" }, { status: 500 })
  }
}
