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