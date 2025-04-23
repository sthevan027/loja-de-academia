import { sql } from "./db"
import { cache } from "react"

export type Product = {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  oldPrice?: number
  category: string
  imageUrl?: string
  inventory: number
  isNew?: boolean
  installments?: number
}

interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  filters?: Record<string, string[]>
}

// Dados mockados para fallback
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Bermuda Térmica Compressão",
    slug: "bermuda-termica-compressao",
    description: "Bermuda térmica de compressão para treinos intensos",
    price: 89.9,
    category: "Roupas Masculinas",
    imageUrl: "/placeholder.svg?height=400&width=300&text=Bermuda+Térmica",
    inventory: 10,
    isNew: true,
    installments: 3,
  },
  {
    id: "2",
    name: "Shorts Masculino Flex",
    slug: "shorts-masculino-flex",
    description: "Shorts masculino flexível para maior conforto",
    price: 69.9,
    category: "Roupas Masculinas",
    imageUrl: "/placeholder.svg?height=400&width=300&text=Shorts+Flex",
    inventory: 15,
    installments: 3,
  },
  {
    id: "3",
    name: "Camiseta Dry-Fit Performance",
    slug: "camiseta-dry-fit-performance",
    description: "Camiseta com tecnologia dry-fit para melhor desempenho",
    price: 89.9,
    oldPrice: 119.9,
    category: "Roupas Masculinas",
    imageUrl: "/placeholder.svg?height=400&width=300&text=Camiseta+Dry-Fit",
    inventory: 20,
    installments: 3,
  },
  {
    id: "4",
    name: "Legging Feminina Power",
    slug: "legging-feminina-power",
    description: "Legging feminina de alta compressão",
    price: 99.9,
    category: "Roupas Femininas",
    imageUrl: "/placeholder.svg?height=400&width=300&text=Legging+Power",
    inventory: 8,
    isNew: true,
    installments: 3,
  },
  {
    id: "5",
    name: "Top Fitness Sustentação",
    slug: "top-fitness-sustentacao",
    description: "Top fitness com alta sustentação para treinos intensos",
    price: 79.9,
    oldPrice: 99.9,
    category: "Roupas Femininas",
    imageUrl: "/placeholder.svg?height=400&width=300&text=Top+Fitness",
    inventory: 12,
    installments: 3,
  },
  {
    id: "6",
    name: "Luvas de Treino Profissional",
    slug: "luvas-treino-profissional",
    description: "Luvas para treino de musculação profissional",
    price: 59.9,
    category: "Acessórios",
    imageUrl: "/placeholder.svg?height=400&width=300&text=Luvas+Treino",
    inventory: 25,
    installments: 3,
  },
  {
    id: "7",
    name: "Garrafa Térmica 1L",
    slug: "garrafa-termica-1l",
    description: "Garrafa térmica com capacidade para 1 litro",
    price: 49.9,
    oldPrice: 69.9,
    category: "Acessórios",
    imageUrl: "/placeholder.svg?height=400&width=300&text=Garrafa+Térmica",
    inventory: 30,
    installments: 3,
  },
  {
    id: "8",
    name: "Corda de Pular Profissional",
    slug: "corda-pular-profissional",
    description: "Corda de pular com rolamento para treinos intensos",
    price: 39.9,
    category: "Acessórios",
    imageUrl: "/placeholder.svg?height=400&width=300&text=Corda+Pular",
    inventory: 18,
    isNew: true,
    installments: 3,
  },
]

// Função otimizada para buscar produtos
export const getProducts = cache(async (filters?: ProductFilters): Promise<Product[]> => {
  try {
    // Usar a sintaxe de template literal correta
    const result = await sql`
      SELECT * FROM products
      LIMIT 24
    `
    return result as Product[]
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    // Retornar dados mockados em caso de erro
    return mockProducts
  }
})

// Função otimizada para buscar produtos em destaque
export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  try {
    const result = await sql`
      SELECT * FROM products 
      WHERE featured = true
      LIMIT 8
    `
    return result as Product[]
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error)
    // Retornar dados mockados em caso de erro
    return mockProducts.slice(0, 8)
  }
})

// Função otimizada para buscar um produto por ID
export const getProductById = cache(async (id: string): Promise<Product | null> => {
  try {
    const result = await sql`
      SELECT * FROM products 
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return null
    }

    return result[0] as Product
  } catch (error) {
    console.error("Erro ao buscar produto por ID:", error)
    // Retornar dados mockados em caso de erro
    return mockProducts.find((p) => p.id === id) || null
  }
})

export const getRelatedProducts = cache(async (categoryId: string, currentProductId: string): Promise<Product[]> => {
  try {
    const result = await sql`
      SELECT * FROM products 
      WHERE category_id = ${categoryId} AND id != ${currentProductId}
      LIMIT 4
    `
    return result as Product[]
  } catch (error) {
    console.error("Erro ao buscar produtos relacionados:", error)
    // Retornar dados mockados em caso de erro
    return mockProducts.filter((p) => p.id !== currentProductId).slice(0, 4)
  }
})
