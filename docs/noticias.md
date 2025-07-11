# Sistema de Notícias - Gestor Solution Hub

## Visão Geral

O sistema de notícias permite gerenciar e exibir notícias relacionadas aos serviços de consultoria em saúde, atualizações do E-SUS, DATASUS e capacitações oferecidas pela empresa.

## Funcionalidades

### Página Principal
- **Seção de Notícias**: Exibe as notícias ativas organizadas por categorias
- **Filtros por Categoria**: Permite filtrar notícias por categorias (Geral, E-SUS, DATASUS, Treinamentos)
- **Modal de Leitura**: Permite ler o conteúdo completo das notícias
- **Design Responsivo**: Adaptado para todos os dispositivos

### Área Administrativa (`/admin`)
- **CRUD Completo**: Criar, editar, visualizar e excluir notícias
- **Ativação/Desativação**: Controle de visibilidade das notícias
- **Categorização**: Organização por categorias com cores personalizadas
- **Upload de Imagens**: Suporte a imagens via URL
- **Validação**: Formulários com validação completa

## Estrutura de Dados

### NewsItem
```typescript
interface NewsItem {
  id: string;
  title: string;           // Título da notícia
  content: string;         // Conteúdo completo
  excerpt: string;         // Resumo/preview
  imageUrl?: string;       // URL da imagem (opcional)
  publishedAt: Date;       // Data de publicação
  isActive: boolean;       // Se está visível no site
  category: string;        // Categoria da notícia
  author: string;          // Autor da notícia
}
```

### NewsCategory
```typescript
interface NewsCategory {
  id: string;
  name: string;           // Nome da categoria
  color: string;          // Cor hex para identificação visual
}
```

## Categorias Padrão

1. **Geral** - Notícias gerais da empresa (#3b82f6)
2. **E-SUS** - Atualizações do sistema E-SUS (#10b981)
3. **DATASUS** - Novidades do DATASUS (#f59e0b)
4. **Treinamentos** - Capacitações e cursos (#8b5cf6)

## Como Usar

### Acessando a Área Administrativa

1. Clique no link "Admin" no cabeçalho do site (versão desktop)
2. Ou navegue diretamente para `/admin`
3. A página de administração será exibida com a lista de notícias

### Criando uma Nova Notícia

1. Na página administrativa, clique em "Nova Notícia"
2. Preencha os campos obrigatórios:
   - **Título**: Título principal da notícia
   - **Resumo**: Texto de preview que aparece nos cards
   - **Conteúdo**: Texto completo da notícia
   - **Categoria**: Selecione uma das categorias disponíveis
   - **Autor**: Nome do autor da notícia
3. Opcionalmente:
   - **URL da Imagem**: Link para imagem ilustrativa
   - **Status**: Marque se a notícia deve estar ativa
4. Clique em "Criar" para salvar

### Editando uma Notícia

1. Na tabela de notícias, clique no ícone de edição
2. Modifique os campos desejados
3. Clique em "Atualizar" para salvar as alterações

### Ativando/Desativando Notícias

1. Na coluna "Status", clique no ícone de olho
2. Notícias ativas (olho aberto) ficam visíveis no site
3. Notícias inativas (olho fechado) ficam ocultas

### Excluindo uma Notícia

1. Clique no ícone de lixeira na linha da notícia
2. Confirme a exclusão no diálogo que aparece
3. **Atenção**: Esta ação não pode ser desfeita

## Armazenamento

O sistema utiliza `localStorage` para persistir os dados. Isso significa que:
- Os dados ficam salvos no navegador do usuário
- Diferentes navegadores/dispositivos terão dados independentes
- Para produção, recomenda-se integrar com um backend

## Dados de Exemplo

O sistema vem com 3 notícias de exemplo:
1. "Novas funcionalidades no E-SUS AB 2024"
2. "Capacitação gratuita em indicadores Previne Brasil"
3. "Novo módulo de Business Intelligence disponível"

## Navegação

### Links Principais
- **Home**: `/` - Página principal com seção de notícias
- **Admin**: `/admin` - Área administrativa
- **Seção Notícias**: `#news` - Âncora para a seção na página principal

### Navegação no Header
- Link "NOTÍCIAS" direciona para a seção na página principal
- Link "Admin" (discreto) permite acesso à área administrativa

## Customização

### Adicionando Novas Categorias

Para adicionar novas categorias, edite o arquivo `src/hooks/useNews.ts`:

```typescript
const defaultCategories: NewsCategory[] = [
  // ... categorias existentes
  { id: '5', name: 'Nova Categoria', color: '#ff6b6b' },
];
```

### Modificando Estilos

As classes CSS estão definidas em `src/index.css`:
- `.bg-brand-gradient`: Gradiente da marca
- `.text-brand-*`: Cores da marca
- `.line-clamp-*`: Truncamento de texto

## Responsividade

O sistema é totalmente responsivo:
- **Desktop**: Grid de 3 colunas para notícias
- **Tablet**: Grid de 2 colunas
- **Mobile**: Coluna única com navegação por tabs

## Acessibilidade

- Formulários com labels apropriados
- Botões com textos descritivos
- Confirmações para ações destrutivas
- Navegação por teclado suportada

## Futuras Melhorias

### Sugeridas para Produção
1. **Backend Integration**: Conectar com API REST
2. **Upload de Imagens**: Sistema próprio de upload
3. **Rich Text Editor**: Editor WYSIWYG para formatação
4. **SEO**: Meta tags e URLs amigáveis
5. **Comentários**: Sistema de comentários nas notícias
6. **Newsletter**: Integração com email marketing
7. **Busca**: Funcionalidade de pesquisa em notícias
8. **Tags**: Sistema de tags além das categorias
9. **Aprovação**: Workflow de aprovação de notícias
10. **Analytics**: Métricas de visualização e engajamento 