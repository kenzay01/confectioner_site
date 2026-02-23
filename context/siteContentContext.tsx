"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { SiteContent } from "@/types/siteContent";
import { defaultSiteContent } from "@/lib/siteContentDefaults";

interface SiteContentContextType {
  content: SiteContent;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

const SITE_CONTENT_API = "/api/site-content";

interface SiteContentProviderProps {
  children: React.ReactNode;
  /** Контент з сервера — одразу показує правильні тексти/фото, без миготіння */
  initialContent?: SiteContent | null;
}

export function SiteContentProvider({ children, initialContent }: SiteContentProviderProps) {
  const [content, setContent] = useState<SiteContent>(initialContent ?? defaultSiteContent);
  const [loading, setLoading] = useState(!initialContent);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(SITE_CONTENT_API);
      if (!res.ok) throw new Error("Failed to fetch site content");
      const data: SiteContent = await res.json();
      setContent(data);
      setError(null);
    } catch {
      setError("Error loading site content");
      setContent(defaultSiteContent);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchContent();
    setLoading(false);
  }, [fetchContent]);

  useEffect(() => {
    setLoading(true);
    fetchContent().finally(() => setLoading(false));
  }, [fetchContent]);

  return (
    <SiteContentContext.Provider value={{ content, loading, error, refresh }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (ctx === undefined) {
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  }
  return ctx;
}
