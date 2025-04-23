import { query } from "./db"

export type Product = {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  old_price: number | null
  category_id: number
  image_url: string | null
  inventory: number
  is_new: boolean
  installments: number
}

export type Category = {
  id: number
  name: string
  slug: string
}

// Funções para produtos
export async function getProducts(filters?: any): Promise<Product[]> {
  try {
    let sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `

    const params: any[] = []

    if (filters?.categoria) {
      sql += ` AND c.slug = $${params.length + 1}`
      params.push(filters.categoria)
    }

    if (filters?.q) {
      sql += ` AND (p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`
      params.push(`%${filters.q}%`)
    }

    if (filters?.min) {
      sql += ` AND p.price >= $${params.length + 1}`
      params.push(Number.parseFloat(filters.min))
    }

    if (filters?.max) {
      sql += ` AND p.price <= $${params.length + 1}`
      params.push(Number.parseFloat(filters.max))
    }

    // Ordenação
    if (filters?.ordenar) {
      switch (filters.ordenar) {
        case "menor-preco":
          sql += ` ORDER BY p.price ASC`
          break
        case "maior-preco":
          sql += ` ORDER BY p.price DESC`
          break
        case "mais-recentes":
          sql += ` ORDER BY p.is_new DESC, p.created_at DESC`
          break
        default:
          sql += ` ORDER BY p.id ASC`
      }
    } else {
      sql += ` ORDER BY p.id ASC`
    }

    const result = await query(sql, params)
    return result.rows as Product[]
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `

    const result = await query(sql, [id])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Product
  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error)
    return null
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = $1
    `

    const result = await query(sql, [slug])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Product
  } catch (error) {
    console.error("Erro ao buscar produto por slug:", error)
    return null
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_new = true OR p.old_price IS NOT NULL
      ORDER BY p.created_at DESC
      LIMIT 8
    `

    const result = await query(sql)
    return result.rows as Product[]
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error)
    return []
  }
}

export async function getRelatedProducts(categoryId: number, currentProductId: number): Promise<Product[]> {
  try {
    const sql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = $1 AND p.id != $2
      LIMIT 4
    `

    const result = await query(sql, [categoryId, currentProductId])
    return result.rows as Product[]
  } catch (error) {
    console.error("Erro ao buscar produtos relacionados:", error)
    return []
  }
}

// Funções para categorias
export async function getCategories(): Promise<Category[]> {
  try {
    const sql = `SELECT * FROM categories ORDER BY name`
    const result = await query(sql)
    return result.rows as Category[]
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const sql = `SELECT * FROM categories WHERE slug = $1`
    const result = await query(sql, [slug])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0] as Category
  } catch (error) {
    console.error("Erro ao buscar categoria por slug:", error)
    return null
  }
}
