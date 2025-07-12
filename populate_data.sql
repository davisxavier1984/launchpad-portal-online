-- Popular dados nas tabelas existentes

-- Inserir categorias padrão (apenas se não existirem)
INSERT INTO categories (name, color) 
SELECT * FROM (VALUES
  ('Geral', '#3B82F6'),
  ('Tecnologia', '#10B981'),
  ('Negócios', '#F59E0B'),
  ('Saúde', '#EF4444'),
  ('Educação', '#8B5CF6')
) AS new_categories(name, color)
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE categories.name = new_categories.name
);

-- Inserir notícias de exemplo (apenas se não existirem)
INSERT INTO news (title, content, excerpt, category, author)
SELECT * FROM (VALUES
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
  )
) AS new_news(title, content, excerpt, category, author)
WHERE NOT EXISTS (
  SELECT 1 FROM news WHERE news.title = new_news.title
);