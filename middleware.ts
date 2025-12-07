import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Виключаємо static files (зображення, css, js тощо)
  const staticFileExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".css",
    ".js",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".pdf",
    ".zip",
    ".json",
    ".xml",
    ".txt",
    ".mp4",
  ];

  const isStaticFile = staticFileExtensions.some((ext) =>
    pathname.toLowerCase().endsWith(ext)
  );

  // Отримуємо мову з cookies
  const savedLocale = request.cookies.get("preferredLocale")?.value;

  // Перевіряємо, чи шлях вже містить локаль
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Створюємо response
  let response: NextResponse;
  
  if (isStaticFile) {
    response = NextResponse.next();
  } else if (pathnameIsMissingLocale) {
    // Використовуємо збережену мову, якщо є, інакше дефолтну
    const locale =
      savedLocale && locales.includes(savedLocale as (typeof locales)[number])
        ? (savedLocale as (typeof locales)[number])
        : defaultLocale;
    response = NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  } else {
    response = NextResponse.next();
  }

  // Строгий захист від майнерів та ін'єкцій через Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    // Скрипти тільки з дозволених джерел, заборонити eval та inline (крім необхідних для Next.js)
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://unpkg.com",
    // Стилі тільки з дозволених джерел
    "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
    // Шрифти тільки з дозволених джерел
    "font-src 'self' https://fonts.gstatic.com data:",
    // Зображення з обмежених джерел
    "img-src 'self' data: https://telebots.site https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://cdnjs.cloudflare.com",
    // З'єднання тільки з дозволених API
    "connect-src 'self' https://api.telegram.org https://api.przelewy24.pl https://secure.przelewy24.pl https://sheets.googleapis.com https://www.googleapis.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com",
    // Заборонити iframe (захист від clickjacking)
    "frame-src 'self' https://secure.przelewy24.pl",
    "frame-ancestors 'none'",
    // Заборонити object, embed, applet (захист від ін'єкцій)
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    // КРИТИЧНО: Заборонити Web Workers та Shared Workers (часто використовуються майнерами)
    "worker-src 'none'",
    // Заборонити WebAssembly (часто використовується майнерами)
    "script-src-elem 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
    // Заборонити виконання скриптів через data: або blob:
    "script-src-attr 'none'",
    // Manifest тільки з власного домену
    "manifest-src 'self'",
    // Медіа тільки з власного домену
    "media-src 'self'",
    // Оновлювати HTTP на HTTPS
    "upgrade-insecure-requests",
    // Заборонити використання небезпечних inline стилів
    "style-src-attr 'unsafe-inline'",
    "style-src-elem 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
  ].join("; ");

  // Додаємо заголовки безпеки
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Розширений Permissions-Policy для блокування майнерів та небезпечних API
  const permissionsPolicy = [
    "geolocation=()",
    "microphone=()",
    "camera=()",
    "payment=()",
    "usb=()",
    "serial=()",
    "bluetooth=()",
    "magnetometer=()",
    "gyroscope=()",
    "accelerometer=()",
    "ambient-light-sensor=()",
    // Заборонити WebAssembly (часто використовується майнерами)
    "wasm-unsafe-eval=()",
    // Заборонити синхронні XHR (може використовуватися для атак)
    "sync-xhr=()",
    // Заборонити повний екран (може використовуватися для обману)
    "fullscreen=(self)",
    // Заборонити picture-in-picture
    "picture-in-picture=()",
  ].join(", ");
  response.headers.set("Permissions-Policy", permissionsPolicy);
  
  // Додаткові заголовки безпеки
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  
  // Захист від MIME type sniffing
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  
  // Захист від clickjacking
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  // Захист від інформаційного витоку через заголовки
  response.headers.set("X-Powered-By", ""); // Прибираємо X-Powered-By

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
