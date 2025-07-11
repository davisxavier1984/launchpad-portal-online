import { useState, useEffect } from 'react';
import { supabase, testConnection } from '@/lib/supabase';
import { NewsItem, NewsCategory } from '@/types/news';
import { validateNewsData, validateCategoryData, rateLimiter } from '@/lib/security';

const STORAGE_KEYS = {
  NEWS: 'news-items-backup',
  CATEGORIES: 'news-categories-backup'
};

const defaultCategories: NewsCategory[] = [
  { id: '1', name: 'Geral', color: '#3b82f6' },
  { id: '2', name: 'E-SUS', color: '#10b981' },
  { id: '3', name: 'DATASUS', color: '#f59e0b' },
  { id: '4', name: 'Treinamentos', color: '#8b5cf6' },
];

const defaultNews: NewsItem[] = [
  {
    id: '1',
    title: 'Novas funcionalidades no E-SUS AB 2024',
    content: 'O Ministério da Saúde lançou atualizações importantes no sistema E-SUS AB que impactam diretamente a gestão municipal. Entre as principais novidades estão melhorias na interface de usuário, novos relatórios de gestão e integração aprimorada com outros sistemas do DATASUS.',
    excerpt: 'Conheça as principais atualizações do E-SUS AB e como elas podem beneficiar sua gestão municipal.',
    imageUrl: '/placeholder.svg',
    publishedAt: new Date('2024-01-15'),
    isActive: true,
    category: 'E-SUS',
    author: 'Equipe Mais Gestor'
  },
  {
    id: '2',
    title: 'Capacitação gratuita em indicadores Previne Brasil',
    content: 'Estamos oferecendo um curso completo sobre os indicadores do Previne Brasil. A capacitação aborda todos os aspectos necessários para maximizar o desempenho do município nos indicadores de qualidade e alcançar melhores resultados no programa.',
    excerpt: 'Participe da nossa capacitação gratuita e melhore os indicadores do seu município.',
    imageUrl: '/placeholder.svg',
    publishedAt: new Date('2024-01-10'),
    isActive: true,
    category: 'Treinamentos',
    author: 'Dr. João Silva'
  },
  {
    id: '3',
    title: 'Novo módulo de Business Intelligence disponível',
    content: 'Lançamos um novo módulo de BI que permite acompanhar em tempo real todos os indicadores de desempenho da Atenção Primária. A ferramenta oferece dashboards intuitivos e relatórios personalizáveis para facilitar a tomada de decisões.',
    excerpt: 'Conheça nossa nova ferramenta de Business Intelligence para gestão da APS.',
    imageUrl: '/placeholder.svg',
    publishedAt: new Date('2024-01-05'),
    isActive: true,
    category: 'Geral',
    author: 'Equipe Técnica'
  }
];

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  // Verificar conexão com Supabase
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await testConnection();
      setIsOnline(connected);
      console.log(connected ? '✅ Conectado ao Supabase' : '⚠️ Usando localStorage como fallback');
    };
    checkConnection();
  }, []);

  // Carregar categorias
  const fetchCategories = async () => {
    if (!isOnline) {
      // Fallback para localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsedCategories = JSON.parse(stored);
        setCategories(parsedCategories);
        return parsedCategories;
      } else {
        setCategories(defaultCategories);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
        return defaultCategories;
      }
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      const formattedCategories: NewsCategory[] = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color
      }));

      setCategories(formattedCategories);
      // Backup no localStorage
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(formattedCategories));
      return formattedCategories;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // Fallback para localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (stored) {
        const parsedCategories = JSON.parse(stored);
        setCategories(parsedCategories);
        return parsedCategories;
      } else {
        setCategories(defaultCategories);
        return defaultCategories;
      }
    }
  };

  // Carregar notícias
  const fetchNews = async () => {
    if (!isOnline) {
      // Fallback para localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (stored) {
        const parsedNews = JSON.parse(stored).map((item: any) => ({
          ...item,
          publishedAt: new Date(item.publishedAt)
        }));
        setNews(parsedNews);
        return parsedNews;
      } else {
        setNews(defaultNews);
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(defaultNews));
        return defaultNews;
      }
    }

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      const formattedNews: NewsItem[] = data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        excerpt: item.excerpt,
        imageUrl: item.image_url,
        category: item.category,
        author: item.author,
        isActive: item.is_active,
        publishedAt: new Date(item.published_at)
      }));

      setNews(formattedNews);
      // Backup no localStorage
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(formattedNews));
      return formattedNews;
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      // Fallback para localStorage
      const stored = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (stored) {
        const parsedNews = JSON.parse(stored).map((item: any) => ({
          ...item,
          publishedAt: new Date(item.publishedAt)
        }));
        setNews(parsedNews);
        return parsedNews;
      } else {
        setNews(defaultNews);
        return defaultNews;
      }
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchNews()]);
      setLoading(false);
    };

    // Aguardar verificação de conexão
    if (isOnline !== null) {
      loadData();
    }
  }, [isOnline]);

  // Adicionar notícia
  const addNews = async (newsItem: Omit<NewsItem, 'id'>) => {
    // Rate limiting para prevenir spam
    const rateLimitKey = 'add_news';
    if (!rateLimiter.canProceed(rateLimitKey)) {
      throw new Error('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.');
    }

    // Validar e sanitizar dados
    try {
      const validatedData = validateNewsData(newsItem);
      
      if (!isOnline) {
        // Fallback para localStorage
        const newItem: NewsItem = {
          ...validatedData,
          id: Date.now().toString(),
        };
        const updatedNews = [...news, newItem];
        setNews(updatedNews);
        localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updatedNews));
        return;
      }

      // Usar dados validados no Supabase
      try {
        const { data, error } = await supabase
          .from('news')
          .insert([
            {
              title: validatedData.title,
              content: validatedData.content,
              excerpt: validatedData.excerpt,
              image_url: validatedData.imageUrl || null,
              category: validatedData.category,
              author: validatedData.author,
              is_active: validatedData.isActive,
              published_at: validatedData.publishedAt.toISOString()
            }
          ])
          .select()
          .single();

        if (error) throw error;

        // Atualizar estado local
        const newItem: NewsItem = {
          id: data.id,
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          imageUrl: data.image_url,
          category: data.category,
          author: data.author,
          isActive: data.is_active,
          publishedAt: new Date(data.published_at)
        };

        setNews(prev => [newItem, ...prev]);
      } catch (supabaseError) {
        console.error('Erro ao adicionar notícia no Supabase:', supabaseError);
        // Fallback para localStorage apenas para erros de conexão
        const newItem: NewsItem = {
          ...validatedData,
          id: Date.now().toString(),
        };
        setNews(prev => [newItem, ...prev]);
      }
    } catch (validationError) {
      throw validationError; // Re-throw validation errors
    }
  };

  // Atualizar notícia
  const updateNews = async (id: string, updatedItem: Partial<NewsItem>) => {
    // Rate limiting
    const rateLimitKey = `update_news_${id}`;
    if (!rateLimiter.canProceed(rateLimitKey)) {
      throw new Error('Muitas tentativas de atualização. Aguarde alguns minutos.');
    }

    // Validar dados se fornecidos
    if (Object.keys(updatedItem).some(key => ['title', 'content', 'excerpt', 'author'].includes(key))) {
      try {
        // Criar objeto completo para validação
        const currentItem = news.find(item => item.id === id);
        if (!currentItem) {
          throw new Error('Notícia não encontrada');
        }

        const itemToValidate = { ...currentItem, ...updatedItem };
        const validatedData = validateNewsData(itemToValidate);
        
        // Usar apenas os campos que foram atualizados
        Object.keys(updatedItem).forEach(key => {
          if (validatedData[key as keyof typeof validatedData] !== undefined) {
            (updatedItem as any)[key] = validatedData[key as keyof typeof validatedData];
          }
        });
        
      } catch (validationError) {
        throw validationError;
      }
    }

    if (!isOnline) {
      // Fallback para localStorage
      const updatedNews = news.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      );
      setNews(updatedNews);
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updatedNews));
      return;
    }

    try {
      const updateData: any = {};
      
      if (updatedItem.title !== undefined) updateData.title = updatedItem.title;
      if (updatedItem.content !== undefined) updateData.content = updatedItem.content;
      if (updatedItem.excerpt !== undefined) updateData.excerpt = updatedItem.excerpt;
      if (updatedItem.imageUrl !== undefined) updateData.image_url = updatedItem.imageUrl;
      if (updatedItem.category !== undefined) updateData.category = updatedItem.category;
      if (updatedItem.author !== undefined) updateData.author = updatedItem.author;
      if (updatedItem.isActive !== undefined) updateData.is_active = updatedItem.isActive;
      if (updatedItem.publishedAt !== undefined) updateData.published_at = updatedItem.publishedAt.toISOString();
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('news')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      setNews(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      ));
    } catch (error) {
      console.error('Erro ao atualizar notícia:', error);
      // Fallback para localStorage
      setNews(prev => prev.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      ));
    }
  };

  // Deletar notícia
  const deleteNews = async (id: string) => {
    if (!isOnline) {
      // Fallback para localStorage
      const updatedNews = news.filter(item => item.id !== id);
      setNews(updatedNews);
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(updatedNews));
      return;
    }

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      setNews(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao deletar notícia:', error);
      // Fallback para localStorage
      setNews(prev => prev.filter(item => item.id !== id));
    }
  };

  const getActiveNews = () => {
    return news
      .filter(item => item.isActive)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  };

  const getNewsByCategory = (categoryName: string) => {
    return news.filter(item => item.category === categoryName && item.isActive);
  };

  const saveCategories = async (newCategories: NewsCategory[]) => {
    setCategories(newCategories);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCategories));
  };

  return {
    news,
    categories,
    loading,
    isOnline,
    addNews,
    updateNews,
    deleteNews,
    getActiveNews,
    getNewsByCategory,
    saveCategories,
    fetchNews,
    fetchCategories
  };
}; 