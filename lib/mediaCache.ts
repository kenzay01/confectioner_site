/** Long-lived cache for static media (1 year + 7d SWR). */
export const MEDIA_CACHE_CONTROL =
  "public, max-age=31536000, stale-while-revalidate=604800, immutable";

export const mediaCacheHeaders: { key: string; value: string }[] = [
  { key: "Cache-Control", value: MEDIA_CACHE_CONTROL },
];

const MEDIA_FILE_EXT =
  "jpg|jpeg|png|gif|webp|avif|svg|ico|bmp|heic|heif|mp4|webm|mov|m4v|mp3|wav|ogg|woff|woff2|ttf|otf";

/** Next.js `headers()` rules for public & optimized media paths. */
export function mediaCacheHeaderRules(): {
  source: string;
  headers: { key: string; value: string }[];
}[] {
  const headers = mediaCacheHeaders;

  return [
    { source: "/uploads/:path*", headers },
    { source: "/materials/:path*", headers },
    { source: "/api/static/:path*", headers },
    { source: "/_next/static/:path*", headers },
    { source: "/_next/image", headers },
    { source: "/_next/image/:path*", headers },
    {
      source: `/:path*\\.(${MEDIA_FILE_EXT})`,
      headers,
    },
  ];
}
