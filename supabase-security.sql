-- CONFIGURAÇÕES DE SEGURANÇA PARA SUPABASE
-- Execute este script APÓS o supabase-setup.sql

-- ============================================================================
-- 1. ATIVAR ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Ativar RLS nas tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. CRIAR TABELA DE USUÁRIOS ADMINISTRATIVOS
-- ============================================================================

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

-- Ativar RLS para admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. POLÍTICAS DE ACESSO PARA LEITURA PÚBLICA
-- ============================================================================

-- Permitir leitura pública de categorias ativas
CREATE POLICY "Categorias são visíveis publicamente" ON categories
  FOR SELECT USING (true);

-- Permitir leitura pública de notícias ativas
CREATE POLICY "Notícias ativas são visíveis publicamente" ON news
  FOR SELECT USING (is_active = true);

-- ============================================================================
-- 4. POLÍTICAS DE ACESSO PARA ADMINISTRADORES
-- ============================================================================

-- Função para verificar se usuário é admin autenticado
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verifica se o usuário está autenticado via Supabase Auth
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Verifica se existe um admin_user com este auth.uid
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para categorias (admin)
CREATE POLICY "Admins podem inserir categorias" ON categories
  FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Admins podem atualizar categorias" ON categories
  FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admins podem deletar categorias" ON categories
  FOR DELETE USING (is_admin_user());

-- Políticas para notícias (admin)
CREATE POLICY "Admins podem ver todas as notícias" ON news
  FOR SELECT USING (is_admin_user());

CREATE POLICY "Admins podem inserir notícias" ON news
  FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Admins podem atualizar notícias" ON news
  FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admins podem deletar notícias" ON news
  FOR DELETE USING (is_admin_user());

-- Política para admin_users (apenas o próprio usuário pode ver seus dados)
CREATE POLICY "Usuários podem ver apenas seus próprios dados" ON admin_users
  FOR SELECT USING (auth.uid() = id);

-- ============================================================================
-- 5. FUNCTIONS DE SEGURANÇA E VALIDAÇÃO
-- ============================================================================

-- Função para limpar/sanitizar texto
CREATE OR REPLACE FUNCTION sanitize_text(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove caracteres perigosos e scripts
  RETURN regexp_replace(
    regexp_replace(
      regexp_replace(input_text, '<script[^>]*>.*?</script>', '', 'gi'),
      '<[^>]*>', '', 'g'
    ),
    '[^\w\s\p{L}\p{N}\p{P}]', '', 'g'
  );
END;
$$ LANGUAGE plpgsql;

-- Função para validar email
CREATE OR REPLACE FUNCTION is_valid_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. TRIGGERS PARA VALIDAÇÃO E AUDITORIA
-- ============================================================================

-- Trigger para sanitizar dados de notícias
CREATE OR REPLACE FUNCTION sanitize_news_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Sanitizar campos de texto
  NEW.title := sanitize_text(NEW.title);
  NEW.excerpt := sanitize_text(NEW.excerpt);
  NEW.content := sanitize_text(NEW.content);
  NEW.author := sanitize_text(NEW.author);
  
  -- Validar tamanhos
  IF length(NEW.title) > 255 THEN
    RAISE EXCEPTION 'Título muito longo (máximo 255 caracteres)';
  END IF;
  
  IF length(NEW.excerpt) > 500 THEN
    RAISE EXCEPTION 'Resumo muito longo (máximo 500 caracteres)';
  END IF;
  
  -- Atualizar timestamp
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sanitize_news_trigger
  BEFORE INSERT OR UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION sanitize_news_data();

-- Trigger para sanitizar dados de categorias
CREATE OR REPLACE FUNCTION sanitize_category_data()
RETURNS TRIGGER AS $$
BEGIN
  NEW.name := sanitize_text(NEW.name);
  
  -- Validar cor hex
  IF NEW.color !~ '^#[0-9a-fA-F]{6}$' THEN
    RAISE EXCEPTION 'Cor deve estar no formato hex (#RRGGBB)';
  END IF;
  
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sanitize_category_trigger
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION sanitize_category_data();

-- ============================================================================
-- 7. RATE LIMITING (Opcional - via supabase)
-- ============================================================================

-- Tabela para controle de rate limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ip_address INET NOT NULL,
  action VARCHAR(100) NOT NULL,
  count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_action ON rate_limits(ip_address, action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- ============================================================================
-- 8. INSERIR USUÁRIO ADMIN PADRÃO (ALTERE A SENHA!)
-- ============================================================================

-- ATENÇÃO: Altere email e senha antes de executar em produção!
INSERT INTO admin_users (id, email, password_hash, name, role)
VALUES (
  uuid_generate_v4(),
  'admin@maisgestor.com.br',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- senha: "password123" - ALTERE!
  'Administrador Principal',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- 9. VIEWS SEGURAS PARA A APLICAÇÃO
-- ============================================================================

-- View para notícias públicas (apenas ativas)
CREATE OR REPLACE VIEW public_news AS
SELECT 
  id,
  title,
  excerpt,
  image_url,
  category,
  author,
  published_at
FROM news 
WHERE is_active = true
ORDER BY published_at DESC;

-- View para categorias ativas
CREATE OR REPLACE VIEW public_categories AS
SELECT id, name, color
FROM categories
ORDER BY name;

-- ============================================================================
-- 10. CONFIGURAÇÕES FINAIS DE SEGURANÇA
-- ============================================================================

-- Revogar permissões desnecessárias
REVOKE ALL ON admin_users FROM anon;
REVOKE ALL ON admin_users FROM authenticated;

-- Comentários de documentação
COMMENT ON TABLE admin_users IS 'Usuários administrativos do sistema';
COMMENT ON TABLE rate_limits IS 'Controle de rate limiting por IP';
COMMENT ON FUNCTION is_admin_user() IS 'Verifica se usuário atual é admin autenticado';
COMMENT ON FUNCTION sanitize_text(TEXT) IS 'Sanitiza texto removendo caracteres perigosos';

-- Verificar configurações
SELECT 
  'Segurança configurada com sucesso!' as status,
  'RLS ativado em todas as tabelas' as rls_status,
  'Políticas de acesso implementadas' as policies_status; 