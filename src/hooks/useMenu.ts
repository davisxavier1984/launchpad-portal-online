import { useState, useEffect } from 'react';
import { MenuItem, SubMenuItem, MenuConfiguration, DbMenuItem, DbMenuSubItem, MenuItemInput, SubMenuItemInput } from '@/types/menu';
import { supabase } from '@/lib/supabase';

// Funções de conversão entre tipos do banco e da aplicação
const convertDbToMenuItem = (dbItem: DbMenuItem, submenu: SubMenuItem[] = []): MenuItem => ({
  id: dbItem.id,
  name: dbItem.name,
  href: dbItem.href,
  order: dbItem.order_position,
  isActive: dbItem.is_active,
  hasSubmenu: dbItem.has_submenu,
  submenu
});

const convertDbToSubMenuItem = (dbSubItem: DbMenuSubItem): SubMenuItem => ({
  id: dbSubItem.id,
  name: dbSubItem.name,
  href: dbSubItem.href,
  order: dbSubItem.order_position,
  isActive: dbSubItem.is_active
});

const convertMenuItemToDb = (item: MenuItem): Partial<DbMenuItem> => ({
  name: item.name,
  href: item.href,
  order_position: item.order,
  is_active: item.isActive,
  has_submenu: item.hasSubmenu
});

const convertSubMenuItemToDb = (subItem: SubMenuItem, parentId: string): Partial<DbMenuSubItem> => ({
  parent_id: parentId,
  name: subItem.name,
  href: subItem.href,
  order_position: subItem.order,
  is_active: subItem.isActive
});

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'INÍCIO',
    href: '#home',
    isActive: true,
    order: 1,
    hasSubmenu: false
  },
  {
    id: '2',
    name: 'SERVIÇOS',
    href: '#services',
    isActive: true,
    order: 2,
    hasSubmenu: true,
    submenu: [
      { id: '2-1', name: 'CONSULTORIA', href: '#consultoria', isActive: true, order: 1 },
      { id: '2-2', name: 'HOSPEDAGEM E SUPORTE', href: '#hospedagem', isActive: true, order: 2 },
      { id: '2-3', name: 'ATENDIMENTO ESPECIALIZADO', href: '#atendimento', isActive: true, order: 3 },
      { id: '2-4', name: 'APLICATIVOS', href: '#aplicativos', isActive: true, order: 4 }
    ]
  },
  {
    id: '3',
    name: 'SOBRE',
    href: '#about',
    isActive: true,
    order: 3,
    hasSubmenu: false
  },
  {
    id: '4',
    name: 'NOTÍCIAS',
    href: '#news',
    isActive: true,
    order: 4,
    hasSubmenu: false
  },
  {
    id: '5',
    name: 'INDICADORES DE DESEMPENHO',
    href: '#indicators',
    isActive: true,
    order: 5,
    hasSubmenu: false
  },
  {
    id: '6',
    name: 'CONTATO',
    href: '#contact',
    isActive: true,
    order: 6,
    hasSubmenu: false
  }
];

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Carregar itens do menu do Supabase
  const loadMenuFromDatabase = async (): Promise<MenuItem[]> => {
    try {
      // Buscar itens principais
      const { data: dbMenuItems, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .order('order_position');

      if (menuError) {
        console.error('Erro ao carregar menu do banco:', menuError);
        throw menuError;
      }

      // Buscar subitens
      const { data: dbSubItems, error: subError } = await supabase
        .from('menu_subitems')
        .select('*')
        .order('order_position');

      if (subError) {
        console.error('Erro ao carregar subitens do banco:', subError);
        throw subError;
      }

      // Converter e organizar dados
      const menuItems: MenuItem[] = (dbMenuItems || []).map(dbItem => {
        const submenu = (dbSubItems || [])
          .filter(subItem => subItem.parent_id === dbItem.id)
          .map(convertDbToSubMenuItem);
        
        return convertDbToMenuItem(dbItem, submenu);
      });

      return menuItems;
    } catch (error) {
      console.error('Erro ao carregar menu do banco:', error);
      throw error;
    }
  };

  // Carregar menu do localStorage como fallback
  const loadMenuFromLocalStorage = (): MenuItem[] => {
    try {
      const savedMenu = localStorage.getItem('menuConfiguration');
      if (savedMenu) {
        const parsedMenu: MenuConfiguration = JSON.parse(savedMenu);
        return parsedMenu.items;
      }
    } catch (error) {
      console.error('Erro ao carregar menu do localStorage:', error);
    }
    return DEFAULT_MENU_ITEMS;
  };

  // Salvar menu no localStorage
  const saveMenuToLocalStorage = (items: MenuItem[]) => {
    try {
      const config: MenuConfiguration = {
        items,
        lastUpdated: new Date()
      };
      localStorage.setItem('menuConfiguration', JSON.stringify(config));
    } catch (error) {
      console.error('Erro ao salvar menu no localStorage:', error);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true);
      try {
        // Tenta carregar do banco primeiro
        const menuFromDb = await loadMenuFromDatabase();
        setMenuItems(menuFromDb);
        // Faz backup no localStorage
        saveMenuToLocalStorage(menuFromDb);
      } catch (error) {
        console.warn('Falha ao carregar do banco, usando localStorage:', error);
        // Fallback para localStorage
        const menuFromLocal = loadMenuFromLocalStorage();
        setMenuItems(menuFromLocal);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  // Salvar configuração híbrida (banco + localStorage)
  const saveMenuConfiguration = async (items: MenuItem[]) => {
    try {
      // Atualiza estado local imediatamente
      setMenuItems([...items]);
      setUpdateTrigger(prev => prev + 1);
      
      // Salva backup no localStorage
      saveMenuToLocalStorage(items);
      
      console.log('Menu salvo no estado e localStorage');
    } catch (error) {
      console.error('Erro ao salvar configuração do menu:', error);
    }
  };

  // Adicionar novo item
  const addMenuItem = async (item: MenuItemInput) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          name: item.name,
          href: item.href,
          order_position: item.order || Math.max(...menuItems.map(i => i.order), 0) + 1,
          is_active: item.isActive ?? true,
          has_submenu: item.hasSubmenu ?? false
        })
        .select()
        .single();

      if (error) throw error;

      const newItem = convertDbToMenuItem(data);
      const updatedItems = [...menuItems, newItem];
      await saveMenuConfiguration(updatedItems);
      
      return newItem;
    } catch (error) {
      console.error('Erro ao adicionar item do menu:', error);
      // Fallback: adiciona apenas localmente
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: item.name,
        href: item.href,
        order: item.order || Math.max(...menuItems.map(i => i.order), 0) + 1,
        isActive: item.isActive ?? true,
        hasSubmenu: item.hasSubmenu ?? false
      };
      const updatedItems = [...menuItems, newItem];
      await saveMenuConfiguration(updatedItems);
      return newItem;
    }
  };

  // Atualizar item existente
  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const dbUpdates: Partial<DbMenuItem> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.href !== undefined) dbUpdates.href = updates.href;
      if (updates.order !== undefined) dbUpdates.order_position = updates.order;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.hasSubmenu !== undefined) dbUpdates.has_submenu = updates.hasSubmenu;

      const { error } = await supabase
        .from('menu_items')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      const updatedItems = menuItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      await saveMenuConfiguration(updatedItems);
    } catch (error) {
      console.error('Erro ao atualizar item do menu:', error);
      // Fallback: atualiza apenas localmente
      const updatedItems = menuItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      await saveMenuConfiguration(updatedItems);
    }
  };

  // Deletar item
  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      const updatedItems = menuItems.filter(item => item.id !== id);
      await saveMenuConfiguration(updatedItems);
    } catch (error) {
      console.error('Erro ao deletar item do menu:', error);
      // Fallback: remove apenas localmente
      const updatedItems = menuItems.filter(item => item.id !== id);
      await saveMenuConfiguration(updatedItems);
    }
  };

  // Adicionar submenu
  const addSubMenuItem = async (parentId: string, subItem: SubMenuItemInput) => {
    try {
      const { data, error } = await supabase
        .from('menu_subitems')
        .insert({
          parent_id: parentId,
          name: subItem.name,
          href: subItem.href,
          order_position: subItem.order || 1,
          is_active: subItem.isActive ?? true
        })
        .select()
        .single();

      if (error) throw error;

      const newSubItem = convertDbToSubMenuItem(data);
      const updatedItems = menuItems.map(item => {
        if (item.id === parentId) {
          const updatedSubmenu = [...(item.submenu || []), newSubItem].sort((a, b) => a.order - b.order);
          return { ...item, submenu: updatedSubmenu, hasSubmenu: true };
        }
        return item;
      });
      
      await saveMenuConfiguration(updatedItems);
    } catch (error) {
      console.error('Erro ao adicionar subitem:', error);
      // Fallback: adiciona apenas localmente
      const newSubItem: SubMenuItem = {
        id: Date.now().toString(),
        name: subItem.name,
        href: subItem.href,
        order: subItem.order || 1,
        isActive: subItem.isActive ?? true
      };
      
      const updatedItems = menuItems.map(item => {
        if (item.id === parentId) {
          const updatedSubmenu = [...(item.submenu || []), newSubItem].sort((a, b) => a.order - b.order);
          return { ...item, submenu: updatedSubmenu, hasSubmenu: true };
        }
        return item;
      });
      
      await saveMenuConfiguration(updatedItems);
    }
  };

  // Atualizar submenu
  const updateSubMenuItem = async (parentId: string, subId: string, updates: Partial<SubMenuItem>) => {
    try {
      const dbUpdates: Partial<DbMenuSubItem> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.href !== undefined) dbUpdates.href = updates.href;
      if (updates.order !== undefined) dbUpdates.order_position = updates.order;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

      const { error } = await supabase
        .from('menu_subitems')
        .update(dbUpdates)
        .eq('id', subId);

      if (error) throw error;

      const updatedItems = menuItems.map(item => {
        if (item.id === parentId && item.submenu) {
          const updatedSubmenu = item.submenu.map(subItem =>
            subItem.id === subId ? { ...subItem, ...updates } : subItem
          ).sort((a, b) => a.order - b.order);
          return { ...item, submenu: updatedSubmenu };
        }
        return item;
      });
      
      await saveMenuConfiguration(updatedItems);
    } catch (error) {
      console.error('Erro ao atualizar subitem:', error);
      // Fallback: atualiza apenas localmente
      const updatedItems = menuItems.map(item => {
        if (item.id === parentId && item.submenu) {
          const updatedSubmenu = item.submenu.map(subItem =>
            subItem.id === subId ? { ...subItem, ...updates } : subItem
          ).sort((a, b) => a.order - b.order);
          return { ...item, submenu: updatedSubmenu };
        }
        return item;
      });
      
      await saveMenuConfiguration(updatedItems);
    }
  };

  // Deletar submenu
  const deleteSubMenuItem = async (parentId: string, subId: string) => {
    try {
      const { error } = await supabase
        .from('menu_subitems')
        .delete()
        .eq('id', subId);

      if (error) throw error;

      const updatedItems = menuItems.map(item => {
        if (item.id === parentId && item.submenu) {
          const updatedSubmenu = item.submenu.filter(subItem => subItem.id !== subId);
          return { 
            ...item, 
            submenu: updatedSubmenu,
            hasSubmenu: updatedSubmenu.length > 0
          };
        }
        return item;
      });
      
      await saveMenuConfiguration(updatedItems);
    } catch (error) {
      console.error('Erro ao deletar subitem:', error);
      // Fallback: remove apenas localmente
      const updatedItems = menuItems.map(item => {
        if (item.id === parentId && item.submenu) {
          const updatedSubmenu = item.submenu.filter(subItem => subItem.id !== subId);
          return { 
            ...item, 
            submenu: updatedSubmenu,
            hasSubmenu: updatedSubmenu.length > 0
          };
        }
        return item;
      });
      
      await saveMenuConfiguration(updatedItems);
    }
  };

  // Mover item para cima
  const moveItemUp = async (id: string) => {
    const sortedItems = [...menuItems].sort((a, b) => a.order - b.order);
    const currentIndex = sortedItems.findIndex(item => item.id === id);
    
    if (currentIndex <= 0) {
      return false; // Já é o primeiro item
    }
    
    // Reorganizar array: mover item atual para posição anterior
    const newSortedItems = [...sortedItems];
    const [movedItem] = newSortedItems.splice(currentIndex, 1);
    newSortedItems.splice(currentIndex - 1, 0, movedItem);
    
    // Reatribuir ordens sequenciais
    const updatedItems = newSortedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    console.log('Antes:', sortedItems.map(i => `${i.name}:${i.order}`));
    console.log('Depois:', updatedItems.map(i => `${i.name}:${i.order}`));
    
    try {
      // Atualizar todas as ordens no banco
      const updates = updatedItems.map(item => ({
        id: item.id,
        order_position: item.order
      }));

      for (const update of updates) {
        await supabase
          .from('menu_items')
          .update({ order_position: update.order_position })
          .eq('id', update.id);
      }
      
      await saveMenuConfiguration(updatedItems);
      return true;
    } catch (error) {
      console.error('Erro ao mover item:', error);
      // Fallback: salva apenas localmente
      await saveMenuConfiguration(updatedItems);
      return true;
    }
  };

  // Mover item para baixo
  const moveItemDown = async (id: string) => {
    const sortedItems = [...menuItems].sort((a, b) => a.order - b.order);
    const currentIndex = sortedItems.findIndex(item => item.id === id);
    
    if (currentIndex >= sortedItems.length - 1) {
      return false; // Já é o último item
    }
    
    // Reorganizar array: mover item atual para posição seguinte
    const newSortedItems = [...sortedItems];
    const [movedItem] = newSortedItems.splice(currentIndex, 1);
    newSortedItems.splice(currentIndex + 1, 0, movedItem);
    
    // Reatribuir ordens sequenciais
    const updatedItems = newSortedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    console.log('Antes:', sortedItems.map(i => `${i.name}:${i.order}`));
    console.log('Depois:', updatedItems.map(i => `${i.name}:${i.order}`));
    
    try {
      // Atualizar todas as ordens no banco
      const updates = updatedItems.map(item => ({
        id: item.id,
        order_position: item.order
      }));

      for (const update of updates) {
        await supabase
          .from('menu_items')
          .update({ order_position: update.order_position })
          .eq('id', update.id);
      }
      
      await saveMenuConfiguration(updatedItems);
      return true;
    } catch (error) {
      console.error('Erro ao mover item:', error);
      // Fallback: salva apenas localmente
      await saveMenuConfiguration(updatedItems);
      return true;
    }
  };

  // Restaurar configuração padrão
  const resetToDefault = async () => {
    try {
      // Limpar todas as tabelas
      await supabase.from('menu_subitems').delete().gte('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('menu_items').delete().gte('id', '00000000-0000-0000-0000-000000000000');
      
      // Recriar dados padrão executando o script SQL
      // Para isso, vamos recarregar do banco que terá os dados padrão
      const menuFromDb = await loadMenuFromDatabase();
      await saveMenuConfiguration(menuFromDb);
    } catch (error) {
      console.error('Erro ao restaurar configuração padrão:', error);
      // Fallback: usar dados locais padrão
      await saveMenuConfiguration(DEFAULT_MENU_ITEMS);
    }
  };

  // Obter apenas itens ativos ordenados
  const getActiveMenuItems = () => {
    return menuItems
      .filter(item => item.isActive)
      .sort((a, b) => a.order - b.order)
      .map(item => ({
        ...item,
        submenu: item.submenu?.filter(sub => sub.isActive).sort((a, b) => a.order - b.order)
      }));
  };

  return {
    menuItems,
    loading,
    updateTrigger,
    getActiveMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addSubMenuItem,
    updateSubMenuItem,
    deleteSubMenuItem,
    moveItemUp,
    moveItemDown,
    resetToDefault
  };
}; 