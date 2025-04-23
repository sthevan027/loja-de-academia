import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

// GET /api/user/profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const sql = `
      SELECT id, name, email, phone, is_admin
      FROM users
      WHERE id = $1
    `

    const result = await query(sql, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Erro ao buscar perfil do usuário:", error)
    return NextResponse.json({ error: "Erro ao buscar perfil do usuário" }, { status: 500 })
  }
}

// PUT /api/user/profile
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: 400 })
    }

    const data = await request.json()

    // Validar os dados
    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    const sql = `
      UPDATE users
      SET name = $1, email = $2, phone = $3
      WHERE id = $4
      RETURNING id, name, email, phone, is_admin
    `

    const result = await query(sql, [data.name, data.email, data.phone || null, id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Erro ao atualizar perfil do usuário:", error)
    return NextResponse.json({ error: "Erro ao atualizar perfil do usuário" }, { status: 500 })
  }
}

// POST /api/user/profile/password
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar os dados
    if (!data.userId || !data.currentPassword || !data.newPassword) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    // Verificar a senha atual
    const userSql = "SELECT password FROM users WHERE id = $1"
    const userResult = await query(userSql, [data.userId])

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(data.currentPassword, userResult.rows[0].password)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Senha atual incorreta" }, { status: 401 })
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(data.newPassword, 10)

    // Atualizar a senha
    const updateSql = "UPDATE users SET password = $1 WHERE id = $2"
    await query(updateSql, [hashedPassword, data.userId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao alterar senha:", error)
    return NextResponse.json({ error: "Erro ao alterar senha" }, { status: 500 })
  }
}
