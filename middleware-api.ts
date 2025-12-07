import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, containsDangerousPatterns } from "@/lib/security";

/**
 * Middleware для API routes - додає захист від атак
 */
export function apiMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Заголовки безпеки для API
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  
  // Заборона кешування для API (захист від кешування чутливих даних)
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  // CORS заголовки (якщо потрібно)
  const origin = request.headers.get("origin");
  if (origin && (origin.includes("localhost") || origin.includes("yourdomain.com"))) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");
  }

  // Перевірка на небезпечні заголовки
  const userAgent = request.headers.get("user-agent") || "";
  const suspiciousPatterns = [
    /curl/i,
    /wget/i,
    /python/i,
    /scanner/i,
    /bot/i,
    /crawler/i,
  ];

  // Дозволяємо тільки легальні боти (Google, тощо)
  const allowedBots = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
  ];

  const isAllowedBot = allowedBots.some(pattern => pattern.test(userAgent));
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent)) && !isAllowedBot;

  if (isSuspicious && request.method !== "GET") {
    return NextResponse.json(
      { error: "Access denied" },
      { status: 403 }
    );
  }

  // Перевірка на небезпечні параметри в URL
  const url = request.nextUrl;
  const urlString = url.toString();
  if (containsDangerousPatterns(urlString)) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }

  return response;
}

