"use client";
import { useContext, createContext, useEffect, useState } from "react";
import { Masterclass } from "@/types/masterclass";
import { OnlineProduct } from "@/types/products";

interface ItemsContextType {
  masterclasses: Masterclass[];
  onlineProducts: OnlineProduct[];
  loading: boolean;
  error: string | null;
  refreshMasterclasses: () => Promise<void>;
  refreshOnlineProducts: () => Promise<void>;
}
const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const ItemsProvider = ({ children }: { children: React.ReactNode }) => {
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  //   console.log("Masterclasses in context:", masterclasses);
  const [onlineProducts, setOnlineProducts] = useState<OnlineProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMasterclasses(), fetchOnlineProducts()]);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <ItemsContext.Provider
      value={{
        masterclasses,
        onlineProducts,
        loading,
        error,
        refreshMasterclasses,
        refreshOnlineProducts,
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
  return context;
};
