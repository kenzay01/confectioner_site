"use client";
import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useItems } from "@/context/itemsContext";
import { OnlineProduct } from "@/types/products";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const router = useRouter();
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { onlineProducts, loading, error } = useItems();
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<OnlineProduct | null>(null);

  // Find the product by ID
  useEffect(() => {
    if (onlineProducts.length > 0) {
      const foundProduct = onlineProducts.find(
        (p) => `product-${p.id}` === productId
      );
      setProduct(foundProduct || null);
    }
  }, [onlineProducts, productId]);

  if (loading) {
    return (
      <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-[var(--accent-color)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-red-500">
            {error ||
              (currentLocale === "pl"
                ? "Produkt nie znaleziony"
                : "Product not found")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:pt-0 pt-14 bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          className="mb-4 px-4 py-2 rounded bg-[var(--brown-color)] text-white flex items-center hover:bg-[var(--accent-color)] transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="inline-block mr-2" />
          {currentLocale === "pl" ? "Powrót" : "Back"}
        </button>
        {/* Title */}
        {/* <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-8 text-center">
          {product.title[currentLocale]}
        </h1> */}

        {/* Main Content: Photo/Video on Left, Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side: Photo/Video */}
          <div className="space-y-6">
            <Image
              src={product.photo || "/placeholder.jpg"}
              alt={product.title[currentLocale]}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-[400px]"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
            {/* {product.video && (
              <video controls className="w-full rounded-lg" src={product.video}>
                <source src={product.video} type="video/mp4" />
                {currentLocale === "pl"
                  ? "Twoja przeglądarka nie obsługuje wideo."
                  : "Your browser does not support the video tag."}
              </video>
            )} */}
          </div>

          {/* Right Side: Details */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10">
            <div className="flex flex-col justify-between h-full space-y-6 items-start">
              <div>
                <h1 className="text-lg sm:text-3xl font-bold text-[var(--brown-color)] mb-4 text-start">
                  {product.title[currentLocale]}
                </h1>
                <div className="sm:text-xl font-bold text-[var(--brown-color)] mb-2">
                  {currentLocale === "pl" ? "Cena:" : "Price:"} {product.price}{" "}
                  zł
                </div>
                <div>
                  <h2 className="sm:text-xl font-bold text-[var(--brown-color)] mb-2">
                    {currentLocale === "pl" ? "Opis" : "Description"}:
                  </h2>
                  <p className="text-[var(--brown-color)] whitespace-break-spaces">
                    {product.description[currentLocale]}
                  </p>
                </div>
              </div>
              <Link
                href={`/${currentLocale}/payment/product-${product.id}`}
                className="inline-block px-6 py-3 rounded-full font-bold text-white bg-[var(--brown-color)] hover:bg-[var(--accent-color)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {currentLocale === "pl" ? "Kupić" : "Buy Now"}
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {/* <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--brown-color)] mb-6 text-center">
            {currentLocale === "pl"
              ? "Najczęściej zadawane pytania"
              : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-4">
            {product.faq && product.faq[currentLocale]?.length > 0 ? (
              product.faq[currentLocale].map(
                (item: { question: string; answer: string }, index: number) => (
                  <div
                    key={index}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10"
                  >
                    <h3 className="text-lg font-semibold text-[var(--brown-color)] mb-2">
                      {item.question}
                    </h3>
                    <p className="text-[var(--brown-color)]">{item.answer}</p>
                  </div>
                )
              )
            ) : (
              <p className="text-center text-[var(--accent-color)]">
                {currentLocale === "pl" ? "Brak FAQ" : "No FAQ available"}
              </p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
