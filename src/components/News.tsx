import { useState } from "react";
import { useNews } from "@/hooks/useNews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, User, Clock } from "lucide-react";
import { NewsItem } from "@/types/news";

const News = () => {
  const { getActiveNews, getNewsByCategory, categories, loading } = useNews();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (loading) {
    return (
      <section id="news" className="py-24 bg-gray-50">
        <div className="container mx-auto container-padding">
          <div className="text-center">
            <div className="animate-pulse">Carregando notícias...</div>
          </div>
        </div>
      </section>
    );
  }

  const activeNews = getActiveNews();
  const displayedNews = selectedCategory === "all" 
    ? activeNews 
    : getNewsByCategory(selectedCategory);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#3b82f6';
  };

  return (
    <section id="news" className="py-24 bg-gray-50">
      <div className="container mx-auto container-padding">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-heading">
            Últimas <span className="gradient-text">Notícias</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Fique por dentro das últimas novidades, atualizações e capacitações 
            relacionadas aos sistemas de saúde e nossa consultoria especializada.
          </p>
        </div>

        {activeNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma notícia disponível no momento.</p>
          </div>
        ) : (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="all">Todas</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.name}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedNews.slice(0, 6).map((news) => (
                  <Card key={news.id} className="glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="relative">
                      {news.imageUrl && (
                        <img 
                          src={news.imageUrl} 
                          alt={news.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <Badge 
                        className="absolute top-4 left-4 text-white"
                        style={{ backgroundColor: getCategoryColor(news.category) }}
                      >
                        {news.category}
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2 hover:text-brand-medium transition-colors">
                        {news.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {news.excerpt}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <CalendarDays size={14} />
                          <span>{formatDate(news.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span>{news.author}</span>
                        </div>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setSelectedNews(news)}
                          >
                            Ler Mais
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge style={{ backgroundColor: getCategoryColor(news.category) }}>
                                {news.category}
                              </Badge>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <CalendarDays size={14} />
                                  <span>{formatDate(news.publishedAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User size={14} />
                                  <span>{news.author}</span>
                                </div>
                              </div>
                            </div>
                            <DialogTitle className="text-left">{news.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {news.imageUrl && (
                              <img 
                                src={news.imageUrl} 
                                alt={news.title}
                                className="w-full h-64 object-cover rounded-lg"
                              />
                            )}
                            <DialogDescription className="text-base text-gray-700 whitespace-pre-line leading-relaxed">
                              {news.content}
                            </DialogDescription>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {displayedNews.length > 6 && (
                <div className="text-center">
                  <Button variant="outline" className="border-brand-light text-brand-dark hover:bg-brand-light/10">
                    Ver Mais Notícias
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default News; 