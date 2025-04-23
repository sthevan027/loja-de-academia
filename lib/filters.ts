import { query } from "./db"

export interface FilterOption {
  id: string
  label: string
}

export interface FilterGroup {
  id: string
  name: string
  options: FilterOption[]
}

export async function getFilters(category = "all"): Promise<Filter[]> {
  try {
    // Buscar filtros para a categoria específica ou para todas as categorias
    const filtersResult = await query(
      `
      SELECT f.id, f.name, f.category
      FROM filters f
      WHERE f.category = $1 OR f.category = 'all'
      ORDER BY f.sort_order
      `,
      [category],
    )

    const filters: Filter[] = []

    // Para cada filtro, buscar suas opções
    for (const filter of filtersResult.rows) {
      const optionsResult = await query(
        `
        SELECT fo.id, fo.label
        FROM filter_options fo
        WHERE fo.filter_id = $1
        ORDER BY fo.sort_order
        `,
        [filter.id],
      )

      filters.push({
        id: filter.id,
        name: filter.name,
        options: optionsResult.rows.map((option) => ({
          id: option.id,
          label: option.label,
        })),
      })
    }

    return filters
  } catch (error) {
    console.error("Erro ao buscar filtros:", error)
    return []
  }
}

export async function getPriceRange(category?: string): Promise<{ min: number; max: number }> {
  try {
    let queryText = `
      SELECT MIN(p.price) as min_price, MAX(p.price) as max_price
      FROM products p
    `

    const queryParams: any[] = []

    if (category) {
      queryText += `
        JOIN categories c ON p.category_id = c.id
        WHERE c.slug = $1
      `
      queryParams.push(category)
    }

    const result = await query(queryText, queryParams)

    if (result.rows.length === 0) {
      return { min: 0, max: 1000 }
    }

    return {
      min: Number.parseFloat(result.rows[0].min_price) || 0,
      max: Number.parseFloat(result.rows[0].max_price) || 1000,
    }
  } catch (error) {
    console.error("Erro ao buscar faixa de preço:", error)
    return { min: 0, max: 1000 }
  }
}
