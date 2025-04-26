import sql from "./db"

export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number
  old_price: number | null
  category_id: number
  image_url: string
  inventory: number
  is_new: boolean
  installments: number
  category_name?: string
}

export type Category = {
  id: number
  name: string
  slug: string
}

export async function getProducts(limit = 6): Promise<Product[]> {
  try {
    const products = await sql<Product[]>`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT ${limit}
    `
    return products
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return []
  }
}

export async function getProductsByCategory(slug: string, limit = 12): Promise<Product[]> {
  try {
    const products = await sql<Product[]>`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE c.slug = ${slug}
      ORDER BY p.created_at DESC
      LIMIT ${limit}
    `
    return products
  } catch (error) {
    console.error("Erro ao buscar produtos por categoria:", error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await sql<Product[]>`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ${slug}
      LIMIT 1
    `
    return products.length > 0 ? products[0] : null
  } catch (error) {
    console.error("Erro ao buscar produto por slug:", error)
    return null
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await sql<Category[]>`
      SELECT * FROM categories
      ORDER BY name
    `
    return categories
  } catch (error) {
    console.error("Erro ao buscar categorias:", error)
    return []
  }
}
