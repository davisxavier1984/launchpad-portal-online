export interface MenuItem {
  id: string;
  name: string;
  href: string;
  isActive: boolean;
  order: number;
  hasSubmenu: boolean;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  name: string;
  href: string;
  isActive: boolean;
  order: number;
}

export interface MenuConfiguration {
  items: MenuItem[];
  lastUpdated: Date;
}

// Tipos para o banco de dados
export interface DbMenuItem {
  id: string;
  name: string;
  href: string;
  order_position: number;
  is_active: boolean;
  has_submenu: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbMenuSubItem {
  id: string;
  parent_id: string;
  name: string;
  href: string;
  order_position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Tipos para operações de CRUD
export interface MenuItemInput {
  name: string;
  href: string;
  order?: number;
  isActive?: boolean;
  hasSubmenu?: boolean;
}

export interface SubMenuItemInput {
  name: string;
  href: string;
  order?: number;
  isActive?: boolean;
} 