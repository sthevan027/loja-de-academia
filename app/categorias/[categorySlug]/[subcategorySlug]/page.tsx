import { Metadata } from "next"
import { notFound } from "next/navigation"
import { categories } from "@/lib/categories"
import ProductGrid from "@/components/product-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Subcategoria",
  description: "Explore produtos por subcategoria",
}

interface SubcategoryPageProps {
  params: {
    slug: string
    subcategorySlug: string
  }
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug, subcategorySlug } = params
  const category = categories.find((c) => c.slug === slug)
  const subcategory = category?.subcategories?.find((s) => s.slug === subcategorySlug)

  if (!category || !subcategory) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm text-gray-600 hover:text-red-600">
          Home
        </Link>{" "}
        &gt;{" "}
        <Link href={`/categorias/${slug}`} className="text-sm text-gray-600 hover:text-red-600">
          {category.name}
        </Link>{" "}
        &gt; <span className="text-sm text-gray-900">{subcategory.name}</span>
      </div>

      <h1 className="mb-8 text-3xl font-bold">{subcategory.name}</h1>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Subcategorias</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                {category.subcategories?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/categorias/${slug}/${sub.slug}`}
                    className={`block py-2 ${
                      sub.slug === subcategorySlug ? "text-red-600 font-medium" : "text-gray-600 hover:text-red-600"
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <ProductGrid category={slug} subcategory={subcategorySlug} />
        </div>
      </div>
    </div>
  )
} 