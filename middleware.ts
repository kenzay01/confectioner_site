import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Перевіряємо, чи шлях починається з локалі
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Якщо користувач зайшов на корінь сайту без локалі
  if (pathname === '/') {
    const locale = defaultLocale;
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  // Якщо шлях не містить локаль, додаємо локаль за замовчуванням
  if (!pathnameHasLocale) {
    const locale = defaultLocale;
    // Перевіряємо, чи це не статичний файл або API route
    if (
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/uploads') &&
      !pathname.includes('.')
    ) {
      return NextResponse.redirect(
        new URL(`/${locale}${pathname}`, request.url)
      );
    }
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
     * - uploads (uploaded files)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads|.*\\..*|materials).*)',
  ],
};
