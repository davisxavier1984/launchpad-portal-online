import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNews } from "@/hooks/useNews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, Save, Menu as MenuIcon, Newspaper, LogOut } from "lucide-react";
import { NewsItem } from "@/types/news";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import MenuAdmin from "@/components/MenuAdmin";

const Admin = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { news, categories, addNews, updateNews, deleteNews, loading } = useNews();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    imageUrl: "",
    category: "",
    author: "",
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      imageUrl: "",
      category: "",
      author: "",
      isActive: true
    });
    setEditingNews(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt || !formData.category || !formData.author) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newsData = {
      ...formData,
      publishedAt: editingNews ? editingNews.publishedAt : new Date(),
    };

    if (editingNews) {
      updateNews(editingNews.id, newsData);
      toast({
        title: "Sucesso",
        description: "Notícia atualizada com sucesso!",
      });
    } else {
      addNews(newsData);
      toast({
        title: "Sucesso",
        description: "Notícia criada com sucesso!",
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (newsItem: NewsItem) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt,
      imageUrl: newsItem.imageUrl || "",
      category: newsItem.category,
      author: newsItem.author,
      isActive: newsItem.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteNews(id);
    toast({
      title: "Sucesso",
      description: "Notícia excluída com sucesso!",
    });
  };

  const toggleActive = (id: string, currentStatus: boolean) => {
    updateNews(id, { isActive: !currentStatus });
    toast({
      title: "Sucesso",
      description: `Notícia ${!currentStatus ? 'ativada' : 'desativada'} com sucesso!`,
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#3b82f6';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto container-padding py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={20} />
                Voltar ao Site
              </Button>
              
              {/* Logo do Painel Admin */}
              <img 
                src="/logo.png" 
                alt="Gestor Solution Logo" 
                width="60" 
                height="60" 
                className="rounded-lg"
              />
              
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Gerencie notícias e configure o menu de navegação do site
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild className="hidden">
                <Button className="hidden">
                  Nova Notícia
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingNews ? 'Editar Notícia' : 'Nova Notícia'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingNews ? 'Edite as informações da notícia.' : 'Preencha as informações da nova notícia.'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Digite o título da notícia"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Resumo *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Digite um resumo da notícia"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Digite o conteúdo completo da notícia"
                      rows={8}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Autor *</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Digite o nome do autor"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL da Imagem</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Digite a URL da imagem (opcional)"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="isActive">Notícia ativa</Label>
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
                      {editingNews ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto container-padding py-8">
        <Tabs defaultValue="news" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper size={16} />
              Gerenciar Notícias
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <MenuIcon size={16} />
              Configurar Menu
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Gerenciar Notícias</CardTitle>
                    <CardDescription>
                      Visualize, edite e gerencie todas as notícias do sistema.
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-brand-gradient hover:opacity-90 transition-opacity"
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(true);
                    }}
                  >
                    <Plus size={20} className="mr-2" />
                    Nova Notícia
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {news.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">Nenhuma notícia cadastrada ainda.</p>
                    <Button 
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-brand-gradient hover:opacity-90"
                    >
                      <Plus size={20} className="mr-2" />
                      Criar Primeira Notícia
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {news.map((newsItem) => (
                        <TableRow key={newsItem.id}>
                          <TableCell className="font-medium max-w-xs truncate">
                            {newsItem.title}
                          </TableCell>
                          <TableCell>
                            <Badge style={{ backgroundColor: getCategoryColor(newsItem.category) }}>
                              {newsItem.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{newsItem.author}</TableCell>
                          <TableCell>{formatDate(newsItem.publishedAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleActive(newsItem.id, newsItem.isActive)}
                                className={newsItem.isActive ? "text-green-600" : "text-gray-400"}
                              >
                                {newsItem.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                              </Button>
                              <span className={`text-sm ${newsItem.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                                {newsItem.isActive ? 'Ativa' : 'Inativa'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(newsItem)}
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
                                      Tem certeza que deseja excluir a notícia "{newsItem.title}"? 
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(newsItem.id)}
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
          </TabsContent>
          
          <TabsContent value="menu">
            <MenuAdmin />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin; 