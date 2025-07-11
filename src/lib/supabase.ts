import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Variáveis de ambiente do Supabase não encontradas. Usando fallback para localStorage.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

// Verificar conexão
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1)
    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro na conexão com Supabase:', error)
    return false
  }
}

// Tipos para TypeScript
export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          image_url: string | null
          category: string
          author: string
          is_active: boolean
          published_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          image_url?: string | null
          category: string
          author: string
          is_active?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          image_url?: string | null
          category?: string
          author?: string
          is_active?: boolean
          published_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 