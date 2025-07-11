-- Configuração do Banco de Dados Supabase para Gestor Solution Hub
-- Execute este script no SQL Editor do Supabase

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

-- Inserir categorias padrão (apenas se não existirem)
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

-- Inserir notícias de exemplo (apenas se a tabela estiver vazia)
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);

-- Comentários para documentação
COMMENT ON TABLE categories IS 'Categorias das notícias do sistema';
COMMENT ON TABLE news IS 'Notícias e artigos do site';

-- Verificar se tudo foi criado corretamente
SELECT 'Categorias criadas:' as info, count(*) as total FROM categories
UNION ALL
SELECT 'Notícias criadas:' as info, count(*) as total FROM news; 