-- Inserir categorias principais
INSERT INTO categories (name, slug, description) VALUES
('Homens', 'homens', 'Roupas e acessórios para homens'),
('Mulheres', 'mulheres', 'Roupas e acessórios para mulheres'),
('Acessórios', 'acessorios', 'Acessórios para treino'),
('Promoções', 'promocoes', 'Ofertas e descontos especiais');

-- Inserir subcategorias para Homens
INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Oversized', 'oversized', 'Camisetas oversized para homens'
FROM categories c WHERE c.slug = 'homens';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Dry Fit', 'dry-fit', 'Roupas dry fit para homens'
FROM categories c WHERE c.slug = 'homens';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Shorts e Calças', 'shorts-e-calcas', 'Shorts e calças para homens'
FROM categories c WHERE c.slug = 'homens';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Camisetas e Regatas', 'camisetas-e-regatas', 'Camisetas e regatas para homens'
FROM categories c WHERE c.slug = 'homens';

-- Inserir subcategorias para Mulheres
INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Oversized', 'oversized', 'Camisetas oversized para mulheres'
FROM categories c WHERE c.slug = 'mulheres';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Dry Fit', 'dry-fit', 'Roupas dry fit para mulheres'
FROM categories c WHERE c.slug = 'mulheres';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Shorts e Calças', 'shorts-e-calcas', 'Shorts e calças para mulheres'
FROM categories c WHERE c.slug = 'mulheres';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Tops e Regatas', 'tops-e-regatas', 'Tops e regatas para mulheres'
FROM categories c WHERE c.slug = 'mulheres';

-- Inserir subcategorias para Acessórios
INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Cinto de Musculação', 'cinto-musculacao', 'Cintos de musculação'
FROM categories c WHERE c.slug = 'acessorios';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Straps', 'straps', 'Straps para treino'
FROM categories c WHERE c.slug = 'acessorios';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Luvas de Treino', 'luvas-treino', 'Luvas para treino'
FROM categories c WHERE c.slug = 'acessorios';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Compressão', 'compressao', 'Roupas de compressão'
FROM categories c WHERE c.slug = 'acessorios';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Mochilas', 'mochilas', 'Mochilas para academia'
FROM categories c WHERE c.slug = 'acessorios';

-- Inserir subcategorias para Promoções
INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Descontos por Categoria', 'descontos-categoria', 'Descontos especiais por categoria'
FROM categories c WHERE c.slug = 'promocoes';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Ofertas por Tempo Limitado', 'ofertas-tempo-limitado', 'Ofertas com tempo limitado'
FROM categories c WHERE c.slug = 'promocoes';

INSERT INTO subcategories (category_id, name, slug, description)
SELECT c.id, 'Outlet', 'outlet', 'Produtos em promoção'
FROM categories c WHERE c.slug = 'promocoes'; 