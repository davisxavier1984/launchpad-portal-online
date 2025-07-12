-- Tabela principal de itens de menu
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  href VARCHAR(500) NOT NULL,
  order_position INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  has_submenu BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de subitens de menu
CREATE TABLE IF NOT EXISTS menu_subitems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  href VARCHAR(500) NOT NULL,
  order_position INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_subitems_updated_at
  BEFORE UPDATE ON menu_subitems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_menu_items_order ON menu_items(order_position);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON menu_items(is_active);
CREATE INDEX IF NOT EXISTS idx_menu_subitems_parent ON menu_subitems(parent_id);
CREATE INDEX IF NOT EXISTS idx_menu_subitems_order ON menu_subitems(order_position);

-- Row Level Security (RLS)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_subitems ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança

-- Permitir leitura pública dos itens ativos
CREATE POLICY "Allow public read of active menu items" ON menu_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read of active menu subitems" ON menu_subitems
  FOR SELECT USING (is_active = true);

-- Permitir todas as operações para admins
CREATE POLICY "Allow all operations for admin users on menu_items" ON menu_items
  FOR ALL USING (is_admin_user());

CREATE POLICY "Allow all operations for admin users on menu_subitems" ON menu_subitems
  FOR ALL USING (is_admin_user());

-- Inserir dados padrão do menu
INSERT INTO menu_items (id, name, href, order_position, is_active, has_submenu) VALUES
  ('11111111-1111-1111-1111-111111111111', 'INÍCIO', '#home', 1, true, false),
  ('22222222-2222-2222-2222-222222222222', 'SERVIÇOS', '#services', 2, true, true),
  ('33333333-3333-3333-3333-333333333333', 'SOBRE', '#about', 3, true, false),
  ('44444444-4444-4444-4444-444444444444', 'NOTÍCIAS', '#news', 4, true, false),
  ('55555555-5555-5555-5555-555555555555', 'INDICADORES DE DESEMPENHO', '#indicators', 5, true, false),
  ('66666666-6666-6666-6666-666666666666', 'CONTATO', '#contact', 6, true, false)
ON CONFLICT (id) DO NOTHING;

-- Inserir subitens do menu SERVIÇOS
INSERT INTO menu_subitems (parent_id, name, href, order_position, is_active) VALUES
  ('22222222-2222-2222-2222-222222222222', 'CONSULTORIA', '#consultoria', 1, true),
  ('22222222-2222-2222-2222-222222222222', 'HOSPEDAGEM E SUPORTE', '#hospedagem', 2, true),
  ('22222222-2222-2222-2222-222222222222', 'ATENDIMENTO ESPECIALIZADO', '#atendimento', 3, true),
  ('22222222-2222-2222-2222-222222222222', 'APLICATIVOS', '#aplicativos', 4, true)
ON CONFLICT DO NOTHING;