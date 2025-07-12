-- Configuração do Banco de Dados Supabase para Gestor Solution Hub
-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notícias
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT,
  category VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários administrativos
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Ativar Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Função para verificar se usuário é admin autenticado
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas de acesso para leitura pública
CREATE POLICY "Categorias são visíveis publicamente" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Notícias ativas são visíveis publicamente" ON news
  FOR SELECT USING (is_active = true);

-- Políticas de acesso para administradores
CREATE POLICY "Admins podem inserir categorias" ON categories
  FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Admins podem atualizar categorias" ON categories
  FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admins podem deletar categorias" ON categories
  FOR DELETE USING (is_admin_user());

CREATE POLICY "Admins podem ver todas as notícias" ON news
  FOR SELECT USING (is_admin_user());

CREATE POLICY "Admins podem inserir notícias" ON news
  FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Admins podem atualizar notícias" ON news
  FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admins podem deletar notícias" ON news
  FOR DELETE USING (is_admin_user());

CREATE POLICY "Usuários podem ver apenas seus próprios dados" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- Inserir categorias padrão
INSERT INTO categories (name, color) 
SELECT 'Geral', '#3b82f6'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Geral');

INSERT INTO categories (name, color) 
SELECT 'E-SUS', '#10b981'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'E-SUS');

INSERT INTO categories (name, color) 
SELECT 'DATASUS', '#f59e0b'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'DATASUS');

INSERT INTO categories (name, color) 
SELECT 'Treinamentos', '#8b5cf6'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Treinamentos');

-- Inserir notícias de exemplo
INSERT INTO news (title, content, excerpt, image_url, category, author, is_active) 
SELECT 
  'Novas funcionalidades no E-SUS AB 2024',
  'O Ministério da Saúde lançou atualizações importantes no sistema E-SUS AB que impactam diretamente a gestão municipal. Entre as principais novidades estão melhorias na interface de usuário, novos relatórios de gestão e integração aprimorada com outros sistemas do DATASUS.',
  'Conheça as principais atualizações do E-SUS AB e como elas podem beneficiar sua gestão municipal.',
  '/placeholder.svg',
  'E-SUS',
  'Equipe Mais Gestor',
  true
WHERE NOT EXISTS (SELECT 1 FROM news WHERE title = 'Novas funcionalidades no E-SUS AB 2024');

INSERT INTO news (title, content, excerpt, image_url, category, author, is_active)
SELECT 
  'Capacitação gratuita em indicadores Previne Brasil',
  'Estamos oferecendo um curso completo sobre os indicadores do Previne Brasil. A capacitação aborda todos os aspectos necessários para maximizar o desempenho do município nos indicadores de qualidade e alcançar melhores resultados no programa.',
  'Participe da nossa capacitação gratuita e melhore os indicadores do seu município.',
  '/placeholder.svg',
  'Treinamentos',
  'Dr. João Silva',
  true
WHERE NOT EXISTS (SELECT 1 FROM news WHERE title = 'Capacitação gratuita em indicadores Previne Brasil');

INSERT INTO news (title, content, excerpt, image_url, category, author, is_active)
SELECT 
  'Novo módulo de Business Intelligence disponível',
  'Lançamos um novo módulo de BI que permite acompanhar em tempo real todos os indicadores de desempenho da Atenção Primária. A ferramenta oferece dashboards intuitivos e relatórios personalizáveis para facilitar a tomada de decisões.',
  'Conheça nossa nova ferramenta de Business Intelligence para gestão da APS.',
  '/placeholder.svg',
  'Geral',
  'Equipe Técnica',
  true
WHERE NOT EXISTS (SELECT 1 FROM news WHERE title = 'Novo módulo de Business Intelligence disponível');

-- Inserir usuário admin padrão (senha: Admin123!@#)
INSERT INTO admin_users (id, email, password_hash, name, role)
VALUES (
  uuid_generate_v4(),
  'admin@maisgestor.com.br',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrador Principal',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);