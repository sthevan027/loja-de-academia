import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/admin/filters
export async function GET(request: NextRequest) {
  try {
    // Buscar todos os filtros
    const filtersQuery = `
      SELECT id, name, category, sort_order
      FROM filters
      ORDER BY sort_order
    `
    const filtersResult = await query(filtersQuery)

    // Buscar todas as opções de filtros
    const optionsQuery = `
      SELECT id, filter_id, label, sort_order
      FROM filter_options
      ORDER BY sort_order
    `
    const optionsResult = await query(optionsQuery)

    // Organizar os resultados
    const filters = filtersResult.rows.map((filter: any) => ({
      ...filter,
      options: optionsResult.rows
        .filter((option: any) => option.filter_id === filter.id)
        .sort((a: any, b: any) => a.sort_order - b.sort_order),
    }))

    return NextResponse.json(filters)
  } catch (error) {
    console.error("Erro ao buscar filtros:", error)
    return NextResponse.json({ error: "Erro ao buscar filtros" }, { status: 500 })
  }
}

// POST /api/admin/filters
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validar dados
    if (!data.name || !data.category) {
      return NextResponse.json({ error: "Nome e categoria são obrigatórios" }, { status: 400 })
    }

    // Inserir filtro
    const insertQuery = `
      INSERT INTO filters (name, category, sort_order)
      VALUES ($1, $2, $3)
      RETURNING id, name, category, sort_order
    `

    const result = await query(insertQuery, [data.name, data.category, data.sort_order || 0])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Erro ao criar filtro:", error)
    return NextResponse.json({ error: "Erro ao criar filtro" }, { status: 500 })
  }
}
