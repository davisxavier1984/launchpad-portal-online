-- Criar tabelas para o Launchpad Portal

-- Tabela de categorias
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notícias
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO categories (name, color) VALUES
  ('Geral', '#3B82F6'),
  ('Tecnologia', '#10B981'),
  ('Negócios', '#F59E0B'),
  ('Saúde', '#EF4444'),
  ('Educação', '#8B5CF6');

-- Inserir notícias de exemplo
INSERT INTO news (title, content, excerpt, category, author) VALUES
  (
    'Bem-vindo ao Mais Gestor',
    'Este é o primeiro post do nosso portal de notícias. Aqui você encontrará as últimas novidades sobre gestão, tecnologia e muito mais.',
    'Conheça o novo portal de notícias Mais Gestor.',
    'Geral',
    'Admin'
  ),
  (
    'Nova atualização do sistema',
    'Lançamos uma nova versão do sistema com melhorias significativas na performance e novas funcionalidades para facilitar o seu dia a dia.',
    'Sistema atualizado com novas funcionalidades.',
    'Tecnologia',
    'Equipe Técnica'
  );

-- Criar usuário admin (você precisa fazer isso pelo dashboard do Supabase)
-- Email: admin@maisgestor.com.br
-- Senha: Admin123!@#

-- Habilitar RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para leitura pública
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "News are viewable by everyone" ON news
  FOR SELECT USING (is_active = true);

-- Políticas para administradores (você precisará configurar isto baseado na autenticação)
CREATE POLICY "Admins can do everything on categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can do everything on news" ON news
  FOR ALL USING (auth.role() = 'authenticated');