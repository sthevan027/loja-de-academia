import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { categories } from "@/lib/categories"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("category")
  const subcategorySlug = searchParams.get("subcategory")
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 12
  const offset = (page - 1) * limit

  try {
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `
    const params: any[] = []
    const conditions: string[] = []

    if (slug) {
      const category = categories.find((c) => c.slug === slug)
      if (category) {
        query += ` AND c.slug = $${params.length + 1}`
        params.push(slug)
      }
    }

    if (subcategorySlug) {
      query += ` AND p.subcategory = $${params.length + 1}`
      params.push(subcategorySlug)
    }

    query += ` ORDER BY p.created_at DESC`

    const result = await query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
} 