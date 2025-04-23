import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// PUT /api/admin/filters/[id]/options/[optionId]/order
export async function PUT(request: NextRequest, { params }: { params: { id: string; optionId: string } }) {
  try {
    const { id, optionId } = params
    const data = await request.json()

    if (!data.direction || !["up", "down"].includes(data.direction)) {
      return NextResponse.json({ error: "Direção inválida" }, { status: 400 })
    }

    // Buscar opção atual
    const currentOptionQuery = `
      SELECT id, sort_order FROM filter_options WHERE id = $1 AND filter_id = $2
    `
    const currentOptionResult = await query(currentOptionQuery, [optionId, id])

    if (currentOptionResult.rows.length === 0) {
      return NextResponse.json({ error: "Opção não encontrada" }, { status: 404 })
    }

    const currentOption = currentOptionResult.rows[0]

    // Buscar opção adjacente
    const adjacentOptionQuery = `
      SELECT id, sort_order FROM filter_options
      WHERE filter_id = $1 AND sort_order ${data.direction === "up" ? "<" : ">"} $2
      ORDER BY sort_order ${data.direction === "up" ? "DESC" : "ASC"}
      LIMIT 1
    `
    const adjacentOptionResult = await query(adjacentOptionQuery, [id, currentOption.sort_order])

    if (adjacentOptionResult.rows.length === 0) {
      return NextResponse.json({ error: "Não é possível mover mais" }, { status: 400 })
    }

    const adjacentOption = adjacentOptionResult.rows[0]

    // Trocar as ordens
    await query("BEGIN")

    await query("UPDATE filter_options SET sort_order = $1 WHERE id = $2", [
      adjacentOption.sort_order,
      currentOption.id,
    ])

    await query("UPDATE filter_options SET sort_order = $1 WHERE id = $2", [
      currentOption.sort_order,
      adjacentOption.id,
    ])

    await query("COMMIT")

    return NextResponse.json({ success: true })
  } catch (error) {
    await query("ROLLBACK")
    console.error("Erro ao reordenar opção:", error)
    return NextResponse.json({ error: "Erro ao reordenar opção" }, { status: 500 })
  }
}
