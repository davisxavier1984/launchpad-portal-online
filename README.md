# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/263737b3-5c3e-4470-9d2a-4e7b468b39b4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/263737b3-5c3e-4470-9d2a-4e7b468b39b4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

Este projeto foi desenvolvido para a **Mais Gestor**, empresa especializada em consultoria para sistemas de saúde do DATASUS, E-SUS AB e treinamentos para profissionais de saúde.

## Funcionalidades

### 🏠 Site Institucional
- Landing page com informações sobre serviços
- Seção de benefícios e consultoria especializada
- Formulário de contato
- Design responsivo e moderno

### 📰 Sistema de Notícias
- **Área Pública**: Exibição de notícias organizadas por categorias
- **Área Administrativa**: CRUD completo para gerenciar notícias
- **Categorias**: Geral, E-SUS, DATASUS, Treinamentos
- **Recursos**: Upload de imagens, ativação/desativação, filtros

### 🔗 Navegação
- `/` - Página principal
- `/admin` - Área administrativa de notícias
- `#news` - Seção de notícias na página principal

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Hooks + localStorage
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Documentação

- **[Sistema de Notícias](docs/noticias.md)**: Guia completo sobre como usar e configurar o sistema de notícias

## Como Usar

### Desenvolvimento Local

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor de desenvolvimento: `npm run dev`
4. Acesse: `http://localhost:5173`

### Área Administrativa

1. Acesse `/admin` ou clique no link "Admin" no cabeçalho
2. Gerencie notícias: criar, editar, ativar/desativar, excluir
3. Organize por categorias com cores personalizadas

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/263737b3-5c3e-4470-9d2a-4e7b468b39b4) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
