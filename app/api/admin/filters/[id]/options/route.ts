import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/admin/filters/[id]/options
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const filterId = params.id

    const optionsQuery = `
      SELECT id, filter_id, label, sort_order
      FROM filter_options
      WHERE filter_id = $1
      ORDER BY sort_order
    `

    const result = await query(optionsQuery, [filterId])

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erro ao buscar opções de filtro:", error)
    return NextResponse.json({ error: "Erro ao buscar opções de filtro" }, { status: 500 })
  }
}

// POST /api/admin/filters/[id]/options
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const filterId = params.id
    const data = await request.json()

    // Validar dados
    if (!data.label) {
      return NextResponse.json({ error: "Label é obrigatório" }, { status: 400 })
    }

    // Verificar se o filtro existe
    const filterQuery = "SELECT id FROM filters WHERE id = $1"
    const filterResult = await query(filterQuery, [filterId])

    if (filterResult.rows.length === 0) {
      return NextResponse.json({ error: "Filtro não encontrado" }, { status: 404 })
    }

    // Inserir opção
    const insertQuery = `
      INSERT INTO filter_options (filter_id, label, sort_order)
      VALUES ($1, $2, $3)
      RETURNING id, filter_id, label, sort_order
    `

    const result = await query(insertQuery, [filterId, data.label, data.sort_order || 0])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao criar opção de filtro:", error)
    return NextResponse.json({ error: "Erro ao criar opção de filtro" }, { status: 500 })
  }
}
