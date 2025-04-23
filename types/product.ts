export type ProductSize = "PP" | "P" | "M" | "G" | "GG" | "XG" | "XXG" | number

export type Product = {
  id: string
  name: string
  description?: string
  price: number
  oldPrice?: number
  category: string
  imageUrl?: string
  inventory: number
  isNew?: boolean
  installments?: number
  availableSizes?: ProductSize[]
  selectedSize?: ProductSize
}
