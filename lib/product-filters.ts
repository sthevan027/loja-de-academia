import { query } from "./db"

export async function associateProductWithFilters(productId: number, filterOptions: number[]) {
  try {
    // Remover associações existentes
    await query("DELETE FROM product_filters WHERE product_id = $1", [productId])

    // Se não houver opções de filtro, retornar
    if (!filterOptions.length) {
      return { success: true }
    }

    // Criar valores para inserção em massa
    const values = filterOptions.map((optionId) => `(${productId}, ${optionId})`).join(", ")

    // Inserir novas associações
    const insertQuery = `
      INSERT INTO product_filters (product_id, filter_option_id)
      VALUES ${values}
      ON CONFLICT (product_id, filter_option_id) DO NOTHING
    `

    await query(insertQuery)

    return { success: true }
  } catch (error) {
    console.error("Erro ao associar produto com filtros:", error)
    return { success: false, error }
  }
}

export async function getProductFilters(productId: number) {
  try {
    const filtersQuery = `
      SELECT f.id as filter_id, f.name as filter_name, 
             fo.id as option_id, fo.label as option_label
      FROM product_filters pf
      JOIN filter_options fo ON pf.filter_option_id = fo.id
      JOIN filters f ON fo.filter_id = f.id
      WHERE pf.product_id = $1
      ORDER BY f.sort_order, fo.sort_order
    `

    const result = await query(filtersQuery, [productId])

    // Agrupar por filtro
    const filters: Record<string, { id: number; name: string; options: { id: number; label: string }[] }> = {}

    result.rows.forEach((row: any) => {
      if (!filters[row.filter_id]) {
        filters[row.filter_id] = {
          id: row.filter_id,
          name: row.filter_name,
          options: [],
        }
      }

      filters[row.filter_id].options.push({
        id: row.option_id,
        label: row.option_label,
      })
    })

    return Object.values(filters)
  } catch (error) {
    console.error("Erro ao buscar filtros do produto:", error)
    return []
  }
}
