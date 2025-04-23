import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Shirt, Supplement, Watch } from "lucide-react"

export const metadata: Metadata = {
  title: "Categorias de Produtos",
  description: "Explore nossa variedade de produtos para academia, incluindo equipamentos, roupas, suplementos e acessórios.",
}

const categories = [
  {
    name: "Equipamentos",
    slug: "equipamentos",
    description: "Máquinas, pesos e acessórios para seu treino",
    icon: Dumbbell,
    color: "text-blue-500",
  },
  {
    name: "Roupas",
    slug: "roupas",
    description: "Roupas confortáveis e estilosas para academia",
    icon: Shirt,
    color: "text-pink-500",
  },
  {
    name: "Suplementos",
    slug: "suplementos",
    description: "Suplementos para melhorar seu desempenho",
    icon: Supplement,
    color: "text-green-500",
  },
  {
    name: "Acessórios",
    slug: "acessorios",
    description: "Acessórios essenciais para seu treino",
    icon: Watch,
    color: "text-purple-500",
  },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nossas Categorias</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Link href={`/categorias/${category.slug}`} key={category.slug}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className={`w-6 h-6 ${category.color}`} />
                    <CardTitle>{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 