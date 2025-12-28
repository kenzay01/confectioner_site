import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Перевіряємо, чи шлях вже містить локаль
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Якщо шлях не містить локаль, додаємо дефолтну
  if (!pathnameHasLocale) {
    const locale = defaultLocale;
    
    // Отримуємо локаль з cookies або використовуємо дефолтну
    const preferredLocale = request.cookies.get('preferredLocale')?.value;
    const localeToUse = preferredLocale && locales.includes(preferredLocale as typeof locales[number]) 
      ? preferredLocale 
      : locale;

    // Робимо редирект на шлях з локаллю
    return NextResponse.redirect(
      new URL(`/${localeToUse}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};

