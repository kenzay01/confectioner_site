/** Uploaded / API-served images: skip Next optimizer (faster first paint). */
export function isApiStaticImage(src: string): boolean {
  return src.startsWith("/api/static/");
}
