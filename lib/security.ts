/**
 * Security utilities for input validation and sanitization
 */

// Заборонені слова та паттерни для захисту від ін'єкцій
const DANGEROUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onclick, onerror, тощо
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /expression\(/gi,
  /@import/gi,
  /moz-binding/gi,
  /<link[^>]*rel=["']stylesheet["']/gi,
  /<style[^>]*>.*?<\/style>/gi,
  /eval\(/gi,
  /Function\(/gi,
  /setTimeout\(/gi,
  /setInterval\(/gi,
  /WebAssembly/gi,
  /Worker\(/gi,
  /SharedWorker\(/gi,
  /ServiceWorker\(/gi,
  /crypto\./gi,
  /\.miner/gi,
  /coinhive/gi,
  /cryptonight/gi,
  /xmrig/gi,
];

// Заборонені URL паттерни
const DANGEROUS_URL_PATTERNS = [
  /javascript:/gi,
  /data:text\/html/gi,
  /vbscript:/gi,
  /file:\/\//gi,
  /\.miner/gi,
  /coinhive/gi,
  /cryptonight/gi,
  /xmrig/gi,
];

/**
 * Перевіряє, чи містить рядок небезпечні паттерни
 */
export function containsDangerousPatterns(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  const normalized = input.toLowerCase();
  
  // Перевірка на небезпечні паттерни
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }
  
  // Перевірка на заборонені слова
  const dangerousKeywords = [
    'coinhive',
    'cryptonight',
    'xmrig',
    'webminer',
    'cryptocurrency',
    'bitcoin',
    'mining',
    'miner',
    'wasm',
    'webassembly',
  ];
  
  for (const keyword of dangerousKeywords) {
    if (normalized.includes(keyword)) {
      // Дозволяємо тільки якщо це частина безпечного тексту (не код)
      if (normalized.includes(`<${keyword}`) || 
          normalized.includes(`${keyword}(`) ||
          normalized.includes(`new ${keyword}`) ||
          normalized.includes(`.${keyword}`)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Перевіряє URL на небезпечні паттерни
 */
export function isDangerousUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return true;
  
  for (const pattern of DANGEROUS_URL_PATTERNS) {
    if (pattern.test(url)) {
      return true;
    }
  }
  
  // Дозволяємо тільки http/https URLs
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/') && !url.startsWith('data:image/')) {
    return true;
  }
  
  return false;
}

/**
 * Санітизує рядок, видаляючи небезпечні символи
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Видаляємо HTML теги
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Видаляємо небезпечні символи
  sanitized = sanitized.replace(/[<>'"&]/g, '');
  
  return sanitized;
}

/**
 * Валідує JSON дані перед парсингом
 */
export function validateJsonInput(input: string, maxSize: number = 1000000): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Invalid input type' };
  }
  
  // Перевірка розміру
  if (input.length > maxSize) {
    return { valid: false, error: 'Input too large' };
  }
  
  // Перевірка на небезпечні паттерни
  if (containsDangerousPatterns(input)) {
    return { valid: false, error: 'Dangerous patterns detected' };
  }
  
  // Перевірка на валідний JSON
  try {
    const parsed = JSON.parse(input);
    
    // Рекурсивна перевірка об'єкта
    if (typeof parsed === 'object' && parsed !== null) {
      const checkObject = (obj: unknown): boolean => {
        if (typeof obj === 'string') {
          return !containsDangerousPatterns(obj);
        }
        if (Array.isArray(obj)) {
          return obj.every(item => checkObject(item));
        }
        if (typeof obj === 'object' && obj !== null) {
          return Object.values(obj).every(value => checkObject(value));
        }
        return true;
      };
      
      if (!checkObject(parsed)) {
        return { valid: false, error: 'Dangerous patterns in object' };
      }
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid JSON format' };
  }
}

/**
 * Валідує ID (тільки цифри та букви)
 */
export function validateId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 100;
}

/**
 * Валідує email
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255 && !containsDangerousPatterns(email);
}

/**
 * Валідує URL
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  if (isDangerousUrl(url)) return false;
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    // Дозволяємо відносні URL
    return url.startsWith('/') && !containsDangerousPatterns(url);
  }
}

/**
 * Rate limiting helper (простий варіант)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = requestCounts.get(identifier);
  
  if (!record || now > record.resetTime) {
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }
  
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: maxRequests - record.count };
}

/**
 * Очищає стару історію rate limiting
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 60000); // Очищаємо кожну хвилину

