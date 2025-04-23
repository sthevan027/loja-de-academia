import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/admin/filters/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Buscar filtro
    const filterQuery = `
      SELECT id, name, category, sort_order
      FROM filters
      WHERE id = $1
    `
    const filterResult = await query(filterQuery, [id])

    if (filterResult.rows.length === 0) {
      return NextResponse.json({ error: "Filtro não encontrado" }, { status: 404 })
    }

    // Buscar opções do filtro
    const optionsQuery = `
      SELECT id, filter_id, label, sort_order
      FROM filter_options
      WHERE filter_id = $1
      ORDER BY sort_order
    `
    const optionsResult = await query(optionsQuery, [id])

    const filter = {
      ...filterResult.rows[0],
      options: optionsResult.rows,
    }

    return NextResponse.json(filter)
  } catch (error) {
    console.error("Erro ao buscar filtro:", error)
    return NextResponse.json({ error: "Erro ao buscar filtro" }, { status: 500 })
  }
}

// PUT /api/admin/filters/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // Validar dados
    if (!data.name || !data.category) {
      return NextResponse.json({ error: "Nome e categoria são obrigatórios" }, { status: 400 })
    }

    // Atualizar filtro
    const updateQuery = `
      UPDATE filters
      SET name = $1, category = $2, sort_order = $3
      WHERE id = $4
      RETURNING id, name, category, sort_order
    `

    const result = await query(updateQuery, [data.name, data.category, data.sort_order || 0, id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Filtro não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Erro ao atualizar filtro:", error)
    return NextResponse.json({ error: "Erro ao atualizar filtro" }, { status: 500 })
  }
}

// DELETE /api/admin/filters/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Excluir opções do filtro primeiro (devido à restrição de chave estrangeira)
    await query("DELETE FROM filter_options WHERE filter_id = $1", [id])

    // Excluir filtro
    const result = await query("DELETE FROM filters WHERE id = $1 RETURNING id", [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Filtro não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir filtro:", error)
    return NextResponse.json({ error: "Erro ao excluir filtro" }, { status: 500 })
  }
}
