import { useState, useEffect } from 'react';
import { MenuItem, SubMenuItem, MenuConfiguration } from '@/types/menu';

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

  // Carregar itens do menu do localStorage
  useEffect(() => {
    const savedMenu = localStorage.getItem('menuConfiguration');
    if (savedMenu) {
      try {
        const parsedMenu: MenuConfiguration = JSON.parse(savedMenu);
        setMenuItems(parsedMenu.items);
      } catch (error) {
        console.error('Erro ao carregar configuração do menu:', error);
        setMenuItems(DEFAULT_MENU_ITEMS);
      }
    } else {
      setMenuItems(DEFAULT_MENU_ITEMS);
    }
    setLoading(false);
  }, []);

  // Salvar configuração no localStorage
  const saveMenuConfiguration = (items: MenuItem[]) => {
    const config: MenuConfiguration = {
      items,
      lastUpdated: new Date()
    };
    localStorage.setItem('menuConfiguration', JSON.stringify(config));
    setMenuItems([...items]); // Força uma nova referência para o React detectar a mudança
  };

  // Adicionar novo item
  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString()
    };
    const updatedItems = [...menuItems, newItem];
    saveMenuConfiguration(updatedItems);
  };

  // Atualizar item existente
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updatedItems = menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    saveMenuConfiguration(updatedItems);
  };

  // Deletar item
  const deleteMenuItem = (id: string) => {
    const updatedItems = menuItems.filter(item => item.id !== id);
    saveMenuConfiguration(updatedItems);
  };

  // Adicionar submenu
  const addSubMenuItem = (parentId: string, subItem: Omit<SubMenuItem, 'id'>) => {
    const newSubItem: SubMenuItem = {
      ...subItem,
      id: Date.now().toString()
    };
    
    const updatedItems = menuItems.map(item => {
      if (item.id === parentId) {
        const updatedSubmenu = [...(item.submenu || []), newSubItem].sort((a, b) => a.order - b.order);
        return { ...item, submenu: updatedSubmenu, hasSubmenu: true };
      }
      return item;
    });
    
    saveMenuConfiguration(updatedItems);
  };

  // Atualizar submenu
  const updateSubMenuItem = (parentId: string, subId: string, updates: Partial<SubMenuItem>) => {
    const updatedItems = menuItems.map(item => {
      if (item.id === parentId && item.submenu) {
        const updatedSubmenu = item.submenu.map(subItem =>
          subItem.id === subId ? { ...subItem, ...updates } : subItem
        ).sort((a, b) => a.order - b.order);
        return { ...item, submenu: updatedSubmenu };
      }
      return item;
    });
    
    saveMenuConfiguration(updatedItems);
  };

  // Deletar submenu
  const deleteSubMenuItem = (parentId: string, subId: string) => {
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
    
    saveMenuConfiguration(updatedItems);
  };

  // Mover item para cima
  const moveItemUp = (id: string) => {
    const sortedItems = [...menuItems].sort((a, b) => a.order - b.order);
    const currentIndex = sortedItems.findIndex(item => item.id === id);
    
    if (currentIndex > 0) {
      const currentItem = sortedItems[currentIndex];
      const previousItem = sortedItems[currentIndex - 1];
      
      // Troca as ordens
      const updatedItems = menuItems.map(item => {
        if (item.id === currentItem.id) {
          return { ...item, order: previousItem.order };
        }
        if (item.id === previousItem.id) {
          return { ...item, order: currentItem.order };
        }
        return item;
      });
      
      saveMenuConfiguration(updatedItems);
      return true;
    }
    return false;
  };

  // Mover item para baixo
  const moveItemDown = (id: string) => {
    const sortedItems = [...menuItems].sort((a, b) => a.order - b.order);
    const currentIndex = sortedItems.findIndex(item => item.id === id);
    
    if (currentIndex < sortedItems.length - 1) {
      const currentItem = sortedItems[currentIndex];
      const nextItem = sortedItems[currentIndex + 1];
      
      // Troca as ordens
      const updatedItems = menuItems.map(item => {
        if (item.id === currentItem.id) {
          return { ...item, order: nextItem.order };
        }
        if (item.id === nextItem.id) {
          return { ...item, order: currentItem.order };
        }
        return item;
      });
      
      saveMenuConfiguration(updatedItems);
      return true;
    }
    return false;
  };

  // Restaurar configuração padrão
  const resetToDefault = () => {
    saveMenuConfiguration(DEFAULT_MENU_ITEMS);
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