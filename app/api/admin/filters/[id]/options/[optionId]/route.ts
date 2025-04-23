import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

// DELETE /api/admin/filters/[id]/options/[optionId]
export async function DELETE(request: NextRequest, { params }: { params: { id: string; optionId: string } }) {
  try {
    const { id, optionId } = params

    // Excluir opção
    const result = await query("DELETE FROM filter_options WHERE id = $1 AND filter_id = $2 RETURNING id", [
      optionId,
      id,
    ])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Opção não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir opção de filtro:", error)
    return NextResponse.json({ error: "Erro ao excluir opção de filtro" }, { status: 500 })
  }
}
