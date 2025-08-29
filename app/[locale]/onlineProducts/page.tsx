"use client";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import Image from "next/image";
import Link from "next/link";
import { useItems } from "@/context/itemsContext";
import { OnlineProduct } from "@/types/products";

export default function OnlineProducts() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { onlineProducts, loading, error } = useItems();

  return (
    <div className="md:pt-0 pt-14 bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-8 text-center">
          {currentLocale === "pl"
            ? "Online produkty od Szefa Jarosława Semkiwa"
            : "Online Products by Chef Yaroslav Semkiv"}
        </h1>
        {loading ? (
          <p className="text-center text-[var(--accent-color)]">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : onlineProducts.length === 0 ? (
          <p className="text-center text-[var(--accent-color)]">
            {currentLocale === "pl"
              ? "Brak produktów online"
              : "No online products available"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {onlineProducts.map((product: OnlineProduct) => (
              <div
                key={product.id}
                className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10"
              >
                <Link
                  href={`/${currentLocale}/onlineProducts/product-${product.id}`}
                  className="group relative rounded-lg overflow-hidden mb-4 block"
                >
                  <Image
                    src={product.photo || "/placeholder.jpg"}
                    alt={product.title[currentLocale]}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {product.title[currentLocale]}
                    </span>
                  </div>
                </Link>
                <h2 className="text-xl font-semibold text-[var(--brown-color)] mb-2">
                  {product.title[currentLocale]}
                </h2>
                <p className="text-[var(--brown-color)] mb-4 line-clamp-3">
                  {product.description[currentLocale]}
                </p>
                <div className="text-2xl font-bold text-[var(--brown-color)] mb-4">
                  {product.price} zł
                </div>
                <Link
                  href={`/${currentLocale}/onlineProducts/product-${product.id}`}
                  className="inline-block px-6 py-3 rounded-full font-bold text-white bg-[var(--brown-color)] hover:bg-[var(--accent-color)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {currentLocale === "pl" ? "Kupić" : "Buy Now"}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
