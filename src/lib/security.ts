import DOMPurify from 'dompurify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// ============================================================================
// SCHEMAS DE VALIDAÇÃO COM ZOD
// ============================================================================

export const NewsSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(255, 'Título deve ter no máximo 255 caracteres')
    .refine(
      (val) => !/<script|javascript:|data:/i.test(val),
      'Título contém conteúdo potencialmente perigoso'
    ),
  
  content: z
    .string()
    .min(1, 'Conteúdo é obrigatório')
    .max(10000, 'Conteúdo deve ter no máximo 10.000 caracteres')
    .refine(
      (val) => !/<script|javascript:|data:/i.test(val),
      'Conteúdo contém conteúdo potencialmente perigoso'
    ),
  
  excerpt: z
    .string()
    .min(1, 'Resumo é obrigatório')
    .max(500, 'Resumo deve ter no máximo 500 caracteres')
    .refine(
      (val) => !/<script|javascript:|data:/i.test(val),
      'Resumo contém conteúdo potencialmente perigoso'
    ),
  
  imageUrl: z
    .string()
    .url('URL da imagem deve ser válida')
    .optional()
    .or(z.literal('')),
  
  category: z
    .string()
    .min(1, 'Categoria é obrigatória')
    .max(100, 'Categoria deve ter no máximo 100 caracteres'),
  
  author: z
    .string()
    .min(1, 'Autor é obrigatório')
    .max(100, 'Autor deve ter no máximo 100 caracteres')
    .refine(
      (val) => !/<script|javascript:|data:/i.test(val),
      'Autor contém conteúdo potencialmente perigoso'
    ),
  
  isActive: z.boolean()
});

export const CategorySchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .refine(
      (val) => !/<script|javascript:|data:/i.test(val),
      'Nome contém conteúdo potencialmente perigoso'
    ),
  
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve estar no formato hex (#RRGGBB)')
});

export const AdminUserSchema = z.object({
  email: z
    .string()
    .email('Email deve ser válido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  
  password: z
    .string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres')
    .refine(
      (val) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(val),
      'Senha deve conter ao menos: 1 maiúscula, 1 minúscula, 1 número e 1 símbolo'
    ),
  
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .refine(
      (val) => !/<script|javascript:|data:/i.test(val),
      'Nome contém conteúdo potencialmente perigoso'
    )
});

// ============================================================================
// FUNÇÕES DE SANITIZAÇÃO
// ============================================================================

/**
 * Sanitiza conteúdo HTML removendo elementos perigosos
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return '';
  
  const config = {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: [],
    FORBID_SCRIPTS: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'link', 'style', 'img', 'video', 'audio'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  };
  
  return DOMPurify.sanitize(dirty, config);
};

/**
 * Sanitiza texto removendo caracteres especiais perigosos
 */
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Valida e sanitiza URL
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    
    // Permitir apenas protocolos seguros
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Protocolo não permitido');
    }
    
    return parsed.toString();
  } catch {
    return '';
  }
};

// ============================================================================
// FUNÇÕES DE CRIPTOGRAFIA
// ============================================================================

/**
 * Gera hash seguro da senha
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // Aumentamos para maior segurança
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Verifica senha contra hash
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Gera token seguro aleatório
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// ============================================================================
// VALIDAÇÃO DE DADOS
// ============================================================================

/**
 * Valida dados de notícia
 */
export const validateNewsData = (data: unknown) => {
  try {
    const validatedData = NewsSchema.parse(data);
    
    // Sanitizar dados após validação
    return {
      ...validatedData,
      title: sanitizeText(validatedData.title),
      content: sanitizeHtml(validatedData.content),
      excerpt: sanitizeText(validatedData.excerpt),
      author: sanitizeText(validatedData.author),
      imageUrl: validatedData.imageUrl ? sanitizeUrl(validatedData.imageUrl) : undefined
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

/**
 * Valida dados de categoria
 */
export const validateCategoryData = (data: unknown) => {
  try {
    const validatedData = CategorySchema.parse(data);
    
    return {
      ...validatedData,
      name: sanitizeText(validatedData.name)
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

// ============================================================================
// RATE LIMITING DO LADO DO CLIENTE
// ============================================================================

class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly windowMs: number;
  private readonly maxAttempts: number;

  constructor(windowMs: number = 60000, maxAttempts: number = 5) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  canProceed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset se passou da janela de tempo
    if (now - attempt.lastAttempt > this.windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Incrementar tentativas
    attempt.count++;
    attempt.lastAttempt = now;

    return attempt.count <= this.maxAttempts;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// ============================================================================
// UTILITÁRIOS DE SEGURANÇA
// ============================================================================

/**
 * Verifica se uma string contém conteúdo potencialmente perigoso
 */
export const containsDangerousContent = (content: string): boolean => {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /document\./i,
    /window\./i
  ];

  return dangerousPatterns.some(pattern => pattern.test(content));
};

/**
 * Valida se o usuário tem permissão para acessar área administrativa
 */
export const validateAdminAccess = (userRole?: string): boolean => {
  return userRole === 'admin' || userRole === 'super_admin';
};

/**
 * Gera nonce para CSP (Content Security Policy)
 */
export const generateNonce = (): string => {
  return generateSecureToken(16);
};

/**
 * Escapa caracteres especiais para uso em regex
 */
export const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// ============================================================================
// CONFIGURAÇÕES DE SEGURANÇA
// ============================================================================

export const SecurityConfig = {
  // Limites de tamanho
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 60000, // 1 minuto
  RATE_LIMIT_MAX_ATTEMPTS: 5,
  
  // Sessão
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  
  // Headers de segurança
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
} as const;

export type NewsValidation = z.infer<typeof NewsSchema>;
export type CategoryValidation = z.infer<typeof CategorySchema>;
export type AdminUserValidation = z.infer<typeof AdminUserSchema>; 