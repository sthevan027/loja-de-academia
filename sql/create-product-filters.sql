-- Tabela para associar produtos a opções de filtro
CREATE TABLE IF NOT EXISTS product_filters (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  filter_option_id INTEGER NOT NULL REFERENCES filter_options(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, filter_option_id)
);

-- Índice para melhorar a performance das consultas
CREATE INDEX IF NOT EXISTS idx_product_filters_product_id ON product_filters(product_id);
CREATE INDEX IF NOT EXISTS idx_product_filters_filter_option_id ON product_filters(filter_option_id);
