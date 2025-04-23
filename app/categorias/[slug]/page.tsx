import { Metadata } from "next"
import { notFound } from "next/navigation"
import { categories } from "@/lib/categories"
import ProductGrid from "@/components/product-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Categorias",
  description: "Explore nossa variedade de produtos por categoria",
}

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const category = categories.find((c) => c.slug === slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{category.name}</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Subcategorias</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {category.subcategories?.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/categorias/${category.slug}/${subcategory.slug}`}
                    className="block py-2 text-gray-600 hover:text-red-600"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <ProductGrid category={category.slug} />
        </div>
      </div>
    </div>
  )
}
