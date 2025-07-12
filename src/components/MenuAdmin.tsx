import { useState, useMemo, useCallback } from "react";
import { useMenu } from "@/hooks/useMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, EyeOff, Save, RefreshCw, ArrowUp, ArrowDown, Link2 } from "lucide-react";
import { MenuItem, SubMenuItem } from "@/types/menu";
import { useToast } from "@/hooks/use-toast";

// Fixed: React Hooks order violation - all hooks now properly declared at component top level
const MenuAdmin = () => {
  // Fixed: Hooks order violation - all hooks now properly declared at top level
  const { toast } = useToast();
  const {
    menuItems,
    loading,
    updateTrigger,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addSubMenuItem,
    updateSubMenuItem,
    deleteSubMenuItem,
    moveItemUp,
    moveItemDown,
    resetToDefault
  } = useMenu();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubMenuDialogOpen, setIsSubMenuDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingSubMenuItem, setEditingSubMenuItem] = useState<{ parentId: string; subItem: SubMenuItem } | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    href: "",
    order: 1,
    isActive: true,
    hasSubmenu: false
  });

  const [subFormData, setSubFormData] = useState({
    name: "",
    href: "",
    order: 1,
    isActive: true
  });

  // Move all useMemo and useCallback hooks before any functions or early returns
  const sortedMenuItems = useMemo(() => {
    return [...menuItems].sort((a, b) => a.order - b.order);
  }, [menuItems, updateTrigger]);

  const handleMoveUp = useCallback(async (id: string) => {
    const success = await moveItemUp(id);
    if (success) {
      toast({
        title: "Sucesso",
        description: "Item movido para cima!",
      });
    }
  }, [moveItemUp, toast]);

  const handleMoveDown = useCallback(async (id: string) => {
    const success = await moveItemDown(id);
    if (success) {
      toast({
        title: "Sucesso", 
        description: "Item movido para baixo!",
      });
    }
  }, [moveItemDown, toast]);

  // Memoize sorted submenus to avoid inline sorting in JSX
  const sortedSubmenus = useMemo(() => {
    const result: Record<string, SubMenuItem[]> = {};
    sortedMenuItems.forEach(item => {
      if (item.submenu) {
        result[item.id] = [...item.submenu].sort((a, b) => a.order - b.order);
      }
    });
    return result;
  }, [sortedMenuItems, updateTrigger]);

  const resetForm = () => {
    setFormData({
      name: "",
      href: "",
      order: Math.max(...menuItems.map(item => item.order), 0) + 1,
      isActive: true,
      hasSubmenu: false
    });
    setEditingMenuItem(null);
  };

  const resetSubForm = () => {
    setSubFormData({
      name: "",
      href: "",
      order: 1,
      isActive: true
    });
    setEditingSubMenuItem(null);
    setSelectedParentId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.href) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingMenuItem) {
        await updateMenuItem(editingMenuItem.id, formData);
        toast({
          title: "Sucesso",
          description: "Item do menu atualizado com sucesso!",
        });
      } else {
        await addMenuItem(formData);
        toast({
          title: "Sucesso",
          description: "Item do menu criado com sucesso!",
        });
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar item do menu.",
        variant: "destructive",
      });
    }
  };

  const handleSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subFormData.name || !subFormData.href || !selectedParentId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingSubMenuItem) {
        await updateSubMenuItem(selectedParentId, editingSubMenuItem.subItem.id, subFormData);
        toast({
          title: "Sucesso",
          description: "Subitem atualizado com sucesso!",
        });
      } else {
        await addSubMenuItem(selectedParentId, subFormData);
        toast({
          title: "Sucesso",
          description: "Subitem criado com sucesso!",
        });
      }
      resetSubForm();
      setIsSubMenuDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar subitem do menu.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (menuItem: MenuItem) => {
    setEditingMenuItem(menuItem);
    setFormData({
      name: menuItem.name,
      href: menuItem.href,
      order: menuItem.order,
      isActive: menuItem.isActive,
      hasSubmenu: menuItem.hasSubmenu
    });
    setIsDialogOpen(true);
  };

  const handleSubEdit = (parentId: string, subItem: SubMenuItem) => {
    setEditingSubMenuItem({ parentId, subItem });
    setSelectedParentId(parentId);
    setSubFormData({
      name: subItem.name,
      href: subItem.href,
      order: subItem.order,
      isActive: subItem.isActive
    });
    setIsSubMenuDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMenuItem(id);
      toast({
        title: "Sucesso",
        description: "Item do menu excluído com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir item do menu.",
        variant: "destructive",
      });
    }
  };

  const handleSubDelete = async (parentId: string, subId: string) => {
    try {
      await deleteSubMenuItem(parentId, subId);
      toast({
        title: "Sucesso",
        description: "Subitem excluído com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir subitem do menu.",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateMenuItem(id, { isActive: !currentStatus });
      toast({
        title: "Sucesso",
        description: `Item ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status do item.",
        variant: "destructive",
      });
    }
  };

  const toggleSubActive = async (parentId: string, subId: string, currentStatus: boolean) => {
    try {
      await updateSubMenuItem(parentId, subId, { isActive: !currentStatus });
      toast({
        title: "Sucesso",
        description: `Subitem ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status do subitem.",
        variant: "destructive",
      });
    }
  };

  const handleResetToDefault = async () => {
    try {
      await resetToDefault();
      toast({
        title: "Sucesso",
        description: "Menu restaurado para configuração padrão!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao restaurar configuração padrão.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-lg">Carregando configuração do menu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Configuração do Menu</CardTitle>
              <CardDescription>
                Gerencie os itens de menu e submenus do site.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <RefreshCw size={16} />
                    Restaurar Padrão
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restaurar configuração padrão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja restaurar o menu para a configuração padrão? 
                      Todas as personalizações serão perdidas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetToDefault}>
                      Restaurar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-brand-gradient hover:opacity-90 transition-opacity"
                    onClick={resetForm}
                  >
                    <Plus size={20} className="mr-2" />
                    Novo Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingMenuItem ? 'Editar Item do Menu' : 'Novo Item do Menu'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingMenuItem ? 'Edite as informações do item.' : 'Crie um novo item para o menu.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: INÍCIO, SERVIÇOS, CONTATO"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="href">Link *</Label>
                      <Input
                        id="href"
                        value={formData.href}
                        onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                        placeholder="Ex: #home, /about, https://..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="order">Ordem</Label>
                      <Input
                        id="order"
                        type="number"
                        min="1"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Item ativo</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hasSubmenu"
                        checked={formData.hasSubmenu}
                        onCheckedChange={(checked) => setFormData({ ...formData, hasSubmenu: checked })}
                      />
                      <Label htmlFor="hasSubmenu">Tem submenu</Label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-brand-gradient hover:opacity-90">
                        <Save size={16} className="mr-2" />
                        {editingMenuItem ? 'Atualizar' : 'Criar'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="menu">Itens do Menu</TabsTrigger>
              <TabsTrigger value="submenu">Gerenciar Submenus</TabsTrigger>
            </TabsList>
            
            <TabsContent value="menu" className="space-y-4">
              {sortedMenuItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">Nenhum item de menu cadastrado.</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-brand-gradient hover:opacity-90"
                  >
                    <Plus size={20} className="mr-2" />
                    Criar Primeiro Item
                  </Button>
                </div>
              ) : (
                <Table key={`menu-items-table-${updateTrigger}-${menuItems.map(item => `${item.id}-${item.order}`).join('-')}`}>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>Submenu</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMenuItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-medium min-w-[30px] text-center">
                              {index + 1}
                            </span>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-blue-50"
                                onClick={() => handleMoveUp(item.id)}
                                disabled={index === 0}
                                title="Mover para cima"
                              >
                                <ArrowUp size={14} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-blue-50"
                                onClick={() => handleMoveDown(item.id)}
                                disabled={index === sortedMenuItems.length - 1}
                                title="Mover para baixo"
                              >
                                <ArrowDown size={14} />
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link2 size={14} className="text-gray-400" />
                            {item.href}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.hasSubmenu ? (
                            <Badge variant="secondary">
                              {item.submenu?.length || 0} item(s)
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleActive(item.id, item.isActive)}
                              className={item.isActive ? "text-green-600" : "text-gray-400"}
                            >
                              {item.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                            </Button>
                            <span className={`text-sm ${item.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                              {item.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit size={16} />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o item "{item.name}"? 
                                    Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="submenu" className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Gerenciar Submenus</h3>
                  <p className="text-sm text-gray-500">Adicione e gerencie itens de submenu para os itens principais.</p>
                </div>
                <Dialog open={isSubMenuDialogOpen} onOpenChange={setIsSubMenuDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-brand-gradient hover:opacity-90"
                      onClick={resetSubForm}
                    >
                      <Plus size={20} className="mr-2" />
                      Novo Subitem
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSubMenuItem ? 'Editar Subitem' : 'Novo Subitem'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingSubMenuItem ? 'Edite as informações do subitem.' : 'Crie um novo subitem para um menu.'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubSubmit} className="space-y-4">
                      {!editingSubMenuItem && (
                        <div className="space-y-2">
                          <Label htmlFor="parentMenu">Menu Principal *</Label>
                          <select
                            id="parentMenu"
                            value={selectedParentId}
                            onChange={(e) => setSelectedParentId(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            required
                          >
                            <option value="">Selecione um menu</option>
                            {sortedMenuItems.filter(item => item.hasSubmenu).map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="subName">Nome *</Label>
                        <Input
                          id="subName"
                          value={subFormData.name}
                          onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })}
                          placeholder="Ex: CONSULTORIA, HOSPEDAGEM"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subHref">Link *</Label>
                        <Input
                          id="subHref"
                          value={subFormData.href}
                          onChange={(e) => setSubFormData({ ...subFormData, href: e.target.value })}
                          placeholder="Ex: #consultoria, /servicos/consultoria"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subOrder">Ordem</Label>
                        <Input
                          id="subOrder"
                          type="number"
                          min="1"
                          value={subFormData.order}
                          onChange={(e) => setSubFormData({ ...subFormData, order: parseInt(e.target.value) || 1 })}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="subIsActive"
                          checked={subFormData.isActive}
                          onCheckedChange={(checked) => setSubFormData({ ...subFormData, isActive: checked })}
                        />
                        <Label htmlFor="subIsActive">Subitem ativo</Label>
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsSubMenuDialogOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-brand-gradient hover:opacity-90">
                          <Save size={16} className="mr-2" />
                          {editingSubMenuItem ? 'Atualizar' : 'Criar'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {sortedMenuItems.filter(item => item.hasSubmenu).map((parentItem) => (
                  <Card key={parentItem.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{parentItem.name}</CardTitle>
                      <CardDescription>
                        Subitens do menu "{parentItem.name}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!parentItem.submenu || parentItem.submenu.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          Nenhum subitem cadastrado para este menu.
                        </p>
                      ) : (
                        <Table key={`submenu-items-table-${parentItem.id}-${parentItem.submenu?.map(sub => `${sub.id}-${sub.order}`).join('-') || 'empty'}`}>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ordem</TableHead>
                              <TableHead>Nome</TableHead>
                              <TableHead>Link</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(sortedSubmenus[parentItem.id] || [])
                              .map((subItem) => (
                              <TableRow key={subItem.id}>
                                <TableCell>{subItem.order}</TableCell>
                                <TableCell className="font-medium">{subItem.name}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Link2 size={14} className="text-gray-400" />
                                    {subItem.href}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleSubActive(parentItem.id, subItem.id, subItem.isActive)}
                                      className={subItem.isActive ? "text-green-600" : "text-gray-400"}
                                    >
                                      {subItem.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </Button>
                                    <span className={`text-sm ${subItem.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                      {subItem.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSubEdit(parentItem.id, subItem)}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                          <Trash2 size={16} />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Tem certeza que deseja excluir o subitem "{subItem.name}"? 
                                            Esta ação não pode ser desfeita.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => handleSubDelete(parentItem.id, subItem.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Excluir
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {sortedMenuItems.filter(item => item.hasSubmenu).length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-gray-500 text-lg mb-4">
                        Nenhum menu principal está configurado para ter submenu.
                      </p>
                      <p className="text-gray-400 text-sm">
                        Configure um item do menu principal para "Tem submenu" para gerenciar subitens.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuAdmin; 