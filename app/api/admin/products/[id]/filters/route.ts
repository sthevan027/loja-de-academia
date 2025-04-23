import { type NextRequest, NextResponse } from "next/server"
import { getProductFilters, associateProductWithFilters } from "@/lib/product-filters"

// GET /api/admin/products/[id]/filters
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID de produto inválido" }, { status: 400 })
    }

    const filters = await getProductFilters(productId)

    return NextResponse.json(filters)
  } catch (error) {
    console.error("Erro ao buscar filtros do produto:", error)
    return NextResponse.json({ error: "Erro ao buscar filtros do produto" }, { status: 500 })
  }
}

// PUT /api/admin/products/[id]/filters
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID de produto inválido" }, { status: 400 })
    }

    const data = await request.json()

    if (!Array.isArray(data.filterOptions)) {
      return NextResponse.json({ error: "Formato de dados inválido" }, { status: 400 })
    }

    const result = await associateProductWithFilters(productId, data.filterOptions)

    if (!result.success) {
      return NextResponse.json({ error: "Erro ao associar filtros ao produto" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar filtros do produto:", error)
    return NextResponse.json({ error: "Erro ao atualizar filtros do produto" }, { status: 500 })
  }
}
