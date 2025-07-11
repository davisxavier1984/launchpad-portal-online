export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  publishedAt: Date;
  isActive: boolean;
  category: string;
  author: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  color: string;
} 