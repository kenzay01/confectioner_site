"use client";
import {
  useContext,
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { Masterclass } from "@/types/masterclass";
import { OnlineProduct } from "@/types/products";

interface ItemsContextType {
  masterclasses: Masterclass[];
  onlineProducts: OnlineProduct[];
  loading: boolean;
  error: string | null;
  refreshMasterclasses: () => Promise<void>;
  refreshOnlineProducts: () => Promise<void>;
  ensureLoaded: () => Promise<void>;
}
const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [onlineProducts, setOnlineProducts] = useState<OnlineProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadStarted = useRef(false);

  const fetchMasterclasses = async () => {
    try {
      const response = await fetch("/api/masterclasses");
      if (!response.ok) {
        throw new Error("Failed to fetch masterclasses");
      }
      const data: Masterclass[] = await response.json();
      setMasterclasses(data);
    } catch (err) {
      setError("Error loading masterclasses");
      console.error(err);
    }
  };

  const fetchOnlineProducts = async () => {
    try {
      const response = await fetch("/api/online-products");
      if (!response.ok) {
        throw new Error("Failed to fetch online products");
      }
      const data: OnlineProduct[] = await response.json();
      setOnlineProducts(data);
    } catch (err) {
      setError("Error loading online products");
      console.error(err);
    }
  };

  const ensureLoaded = useCallback(async () => {
    if (loadStarted.current) return;
    loadStarted.current = true;
    setLoading(true);
    await Promise.all([fetchMasterclasses(), fetchOnlineProducts()]);
    setLoading(false);
  }, []);

  const refreshMasterclasses = async () => {
    setLoading(true);
    await fetchMasterclasses();
    setLoading(false);
  };

  const refreshOnlineProducts = async () => {
    setLoading(true);
    await fetchOnlineProducts();
    setLoading(false);
  };

  return (
    <ItemsContext.Provider
      value={{
        masterclasses,
        onlineProducts,
        loading,
        error,
        refreshMasterclasses,
        refreshOnlineProducts,
        ensureLoaded,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItems = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider");
  }

  useEffect(() => {
    void context.ensureLoaded();
  }, [context.ensureLoaded]);

  return context;
};
