# 🔒 Guia de Segurança - Gestor Solution Hub

## 📋 Medidas de Segurança Implementadas

### 🗄️ **Segurança do Banco de Dados**

#### Row Level Security (RLS)
- ✅ RLS ativado em todas as tabelas
- ✅ Políticas de acesso granulares
- ✅ Separação entre dados públicos e administrativos

#### Políticas de Acesso
```sql
-- Leitura pública apenas para conteúdo ativo
CREATE POLICY "Notícias ativas são visíveis publicamente" ON news
  FOR SELECT USING (is_active = true);

-- Acesso administrativo restrito
CREATE POLICY "Admins podem gerenciar notícias" ON news
  FOR ALL USING (is_admin_user());
```

#### Sanitização no Banco
- ✅ Triggers automáticos para sanitizar dados
- ✅ Validação de tipos e tamanhos
- ✅ Remoção de scripts maliciosos

### 🔐 **Autenticação e Autorização**

#### Sistema de Autenticação
- ✅ Supabase Auth integrado
- ✅ Verificação de usuários administrativos
- ✅ Rate limiting em login (5 tentativas/minuto)
- ✅ Sessões com timeout automático (30 minutos)

#### Controle de Permissões
```typescript
// Verificação de roles
const hasPermission = (permission: string): boolean => {
  switch (user.role) {
    case 'super_admin': return true;
    case 'admin': return ['read_news', 'write_news', 'manage_news'].includes(permission);
    case 'editor': return ['read_news', 'write_news'].includes(permission);
    default: return false;
  }
};
```

### 🧹 **Validação e Sanitização**

#### Validação com Zod
```typescript
const NewsSchema = z.object({
  title: z.string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título muito longo')
    .refine(val => !/<script|javascript:/i.test(val), 'Conteúdo perigoso detectado'),
  // ... outros campos
});
```

#### Sanitização de Dados
- ✅ DOMPurify para limpeza de HTML
- ✅ Remoção de scripts maliciosos
- ✅ Validação de URLs
- ✅ Escape de caracteres especiais

### 🚦 **Rate Limiting**

#### Controle de Tentativas
- ✅ Login: 5 tentativas por minuto
- ✅ Criação de notícias: 5 por minuto
- ✅ Atualizações: 10 por minuto
- ✅ Reset automático após janela de tempo

### 🔒 **Criptografia**

#### Hash de Senhas
```typescript
// bcrypt com salt rounds = 12
const hashedPassword = await bcrypt.hash(password, 12);
```

#### Tokens Seguros
```typescript
// Geração de tokens criptograficamente seguros
const token = crypto.getRandomValues(new Uint8Array(32));
```

## 🛡️ **Configurações de Segurança**

### Variáveis de Ambiente
```bash
# .env.local (NUNCA committar!)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

### Headers de Segurança
```typescript
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

## 🚨 **Procedimentos de Emergência**

### Em Caso de Comprometimento

1. **Revogar Acesso Imediatamente**
   ```sql
   UPDATE admin_users SET is_active = false WHERE id = 'user_id';
   ```

2. **Verificar Logs de Auditoria**
   ```sql
   SELECT * FROM rate_limits WHERE created_at > NOW() - INTERVAL '24 hours';
   ```

3. **Trocar Chaves de API**
   - Gerar nova chave no painel do Supabase
   - Atualizar variáveis de ambiente
   - Reiniciar aplicação

### Monitoramento

#### Logs de Segurança
- ✅ Tentativas de login falhadas
- ✅ Acessos administrativos
- ✅ Modificações de dados
- ✅ Rate limiting ativado

#### Alertas Automáticos
- ❌ Múltiplas tentativas de login
- ❌ Modificações fora do horário comercial
- ❌ Tentativas de injeção de código

## 📋 **Checklist de Segurança**

### Configuração Inicial
- [ ] Executar `supabase-setup.sql`
- [ ] Executar `supabase-security.sql`
- [ ] Configurar variáveis de ambiente
- [ ] Alterar senha padrão do admin
- [ ] Testar autenticação

### Manutenção Regular
- [ ] Atualizar dependências mensalmente
- [ ] Revisar logs de segurança
- [ ] Backup do banco de dados
- [ ] Verificar políticas RLS
- [ ] Testar procedimentos de emergência

### Auditoria de Código
- [ ] Verificar inputs não sanitizados
- [ ] Validar queries SQL
- [ ] Revisar permissões de usuários
- [ ] Testar cenários de ataque
- [ ] Verificar exposição de dados sensíveis

## 🔧 **Comandos Úteis**

### Verificar Segurança
```sql
-- Verificar RLS ativado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE rowsecurity = true;

-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies;
```

### Backup de Segurança
```bash
# Backup do banco (sem dados sensíveis)
pg_dump --schema-only supabase_db > schema_backup.sql
```

## 📞 **Contato de Segurança**

Em caso de vulnerabilidades descobertas:
- 📧 Email: security@maisgestor.com.br
- 🔒 Reporte responsável de vulnerabilidades
- ⚡ Resposta em até 24 horas

---

**⚠️ IMPORTANTE**: Este documento deve ser mantido atualizado conforme novas medidas de segurança são implementadas. 