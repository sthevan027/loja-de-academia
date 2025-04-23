export interface Category {
  id: string
  name: string
  slug: string
  subcategories?: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  slug: string
}

export const categories: Category[] = [
  {
    id: "homens",
    name: "Homens",
    slug: "homens",
    subcategories: [
      {
        id: "oversized",
        name: "Oversized",
        slug: "oversized",
      },
      {
        id: "dry-fit",
        name: "Dry Fit",
        slug: "dry-fit",
      },
      {
        id: "shorts-e-calcas",
        name: "Shorts e Calças",
        slug: "shorts-e-calcas",
      },
      {
        id: "camisetas-e-regatas",
        name: "Camisetas e Regatas",
        slug: "camisetas-e-regatas",
      },
    ],
  },
  {
    id: "mulheres",
    name: "Mulheres",
    slug: "mulheres",
    subcategories: [
      {
        id: "oversized",
        name: "Oversized",
        slug: "oversized",
      },
      {
        id: "dry-fit",
        name: "Dry Fit",
        slug: "dry-fit",
      },
      {
        id: "shorts-e-calcas",
        name: "Shorts e Calças",
        slug: "shorts-e-calcas",
      },
      {
        id: "tops-e-regatas",
        name: "Tops e Regatas",
        slug: "tops-e-regatas",
      },
    ],
  },
  {
    id: "acessorios",
    name: "Acessórios",
    slug: "acessorios",
    subcategories: [
      {
        id: "cinto-musculacao",
        name: "Cinto de Musculação",
        slug: "cinto-musculacao",
      },
      {
        id: "straps",
        name: "Straps",
        slug: "straps",
      },
      {
        id: "luvas-treino",
        name: "Luvas de Treino",
        slug: "luvas-treino",
      },
      {
        id: "compressao",
        name: "Compressão",
        slug: "compressao",
      },
      {
        id: "mochilas",
        name: "Mochilas",
        slug: "mochilas",
      },
    ],
  },
  {
    id: "promocoes",
    name: "Promoções",
    slug: "promocoes",
    subcategories: [
      {
        id: "descontos-categoria",
        name: "Descontos por Categoria",
        slug: "descontos-categoria",
      },
      {
        id: "ofertas-tempo-limitado",
        name: "Ofertas por Tempo Limitado",
        slug: "ofertas-tempo-limitado",
      },
      {
        id: "outlet",
        name: "Outlet",
        slug: "outlet",
      },
    ],
  },
] 