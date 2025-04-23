-- Atualizar produtos existentes com as novas categorias e subcategorias
UPDATE products p
SET category_id = (
    SELECT c.id 
    FROM categories c 
    WHERE c.slug = CASE 
        WHEN p.category = 'homens' THEN 'homens'
        WHEN p.category = 'mulheres' THEN 'mulheres'
        WHEN p.category = 'acessorios' THEN 'acessorios'
        ELSE 'promocoes'
    END
),
subcategory_id = (
    SELECT sc.id 
    FROM subcategories sc 
    JOIN categories c ON sc.category_id = c.id
    WHERE c.slug = CASE 
        WHEN p.category = 'homens' THEN 'homens'
        WHEN p.category = 'mulheres' THEN 'mulheres'
        WHEN p.category = 'acessorios' THEN 'acessorios'
        ELSE 'promocoes'
    END
    AND sc.slug = CASE 
        WHEN p.subcategory = 'oversized' THEN 'oversized'
        WHEN p.subcategory = 'dry-fit' THEN 'dry-fit'
        WHEN p.subcategory = 'shorts-e-calcas' THEN 'shorts-e-calcas'
        WHEN p.subcategory = 'camisetas-e-regatas' THEN 'camisetas-e-regatas'
        WHEN p.subcategory = 'tops-e-regatas' THEN 'tops-e-regatas'
        WHEN p.subcategory = 'cinto-musculacao' THEN 'cinto-musculacao'
        WHEN p.subcategory = 'straps' THEN 'straps'
        WHEN p.subcategory = 'luvas-treino' THEN 'luvas-treino'
        WHEN p.subcategory = 'compressao' THEN 'compressao'
        WHEN p.subcategory = 'mochilas' THEN 'mochilas'
        WHEN p.subcategory = 'descontos-categoria' THEN 'descontos-categoria'
        WHEN p.subcategory = 'ofertas-tempo-limitado' THEN 'ofertas-tempo-limitado'
        WHEN p.subcategory = 'outlet' THEN 'outlet'
        ELSE NULL
    END
);

-- Remover colunas antigas de categoria e subcategoria
ALTER TABLE products
DROP COLUMN category,
DROP COLUMN subcategory; 