import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// PUT /api/admin/filters/[id]/order
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    if (!data.direction || !["up", "down"].includes(data.direction)) {
      return NextResponse.json({ error: "Direção inválida" }, { status: 400 })
    }

    // Buscar filtro atual
    const currentFilterQuery = `
      SELECT id, sort_order FROM filters WHERE id = $1
    `
    const currentFilterResult = await query(currentFilterQuery, [id])

    if (currentFilterResult.rows.length === 0) {
      return NextResponse.json({ error: "Filtro não encontrado" }, { status: 404 })
    }

    const currentFilter = currentFilterResult.rows[0]

    // Buscar filtro adjacente
    const adjacentFilterQuery = `
      SELECT id, sort_order FROM filters
      WHERE sort_order ${data.direction === "up" ? "<" : ">"} $1
      ORDER BY sort_order ${data.direction === "up" ? "DESC" : "ASC"}
      LIMIT 1
    `
    const adjacentFilterResult = await query(adjacentFilterQuery, [currentFilter.sort_order])

    if (adjacentFilterResult.rows.length === 0) {
      return NextResponse.json({ error: "Não é possível mover mais" }, { status: 400 })
    }

    const adjacentFilter = adjacentFilterResult.rows[0]

    // Trocar as ordens
    await query("BEGIN")

    await query("UPDATE filters SET sort_order = $1 WHERE id = $2", [adjacentFilter.sort_order, currentFilter.id])

    await query("UPDATE filters SET sort_order = $1 WHERE id = $2", [currentFilter.sort_order, adjacentFilter.id])

    await query("COMMIT")

    return NextResponse.json({ success: true })
  } catch (error) {
    await query("ROLLBACK")
    console.error("Erro ao reordenar filtro:", error)
    return NextResponse.json({ error: "Erro ao reordenar filtro" }, { status: 500 })
  }
}
