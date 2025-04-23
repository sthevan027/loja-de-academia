import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { categories } from "@/lib/categories"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categorySlug = searchParams.get("category")
    const subcategorySlug = searchParams.get("subcategory")

    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `

    const params: any[] = []

    if (categorySlug) {
      const category = categories.find((c) => c.slug === categorySlug)
      if (category) {
        sql += ` AND c.slug = $${params.length + 1}`
        params.push(categorySlug)
      }
    }

    if (subcategorySlug) {
      sql += ` AND p.subcategory = $${params.length + 1}`
      params.push(subcategorySlug)
    }

    sql += ` ORDER BY p.created_at DESC`

    const result = await query(sql, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
} 