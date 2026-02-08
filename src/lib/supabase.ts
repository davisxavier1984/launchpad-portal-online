import { createClient } from '@supabase/supabase-js'

const FALLBACK_SUPABASE_URL = "https://idujtvokslevjyrnmcnq.supabase.co"
const FALLBACK_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkdWp0dm9rc2xldmp5cm5tY25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyODAwOTQsImV4cCI6MjA2Nzg1NjA5NH0.zVRnyFkAiDtUyoCUUM0AmM4fejfs5g01sF9PGzZv6EE"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Verificar conexão
export const testConnection = async () => {
  try {
    const { error } = await supabase.from('categories').select('count').limit(1)
    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro na conexão com Supabase')
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