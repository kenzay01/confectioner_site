"use client";
import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useItems } from "@/context/itemsContext";
import { OnlineProduct } from "@/types/products";
import { ArrowLeft } from "lucide-react";
import PaymentModal from "@/components/PaymentModal";
import AnimatedSection from "@/components/AnimatedSection";

export default function ProductPage() {
  const router = useRouter();
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { onlineProducts, loading, error } = useItems();
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<OnlineProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <AnimatedSection className="md:pt-0 pt-14 bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          className="mb-4 px-4 py-2 rounded bg-[var(--brown-color)] text-white flex items-center hover:bg-[var(--accent-color)] transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="inline-block mr-2" />
          {currentLocale === "pl" ? "Powrót" : "Back"}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <Image
              src={product.photo || "/placeholder.jpg"}
              alt={product.title[currentLocale]}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-[400px]"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
              priority
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6  ">
            <div className="flex flex-col justify-between h-full space-y-6 items-start">
              <div>
                <h1 className="text-lg sm:text-3xl font-bold  mb-4 text-start">
                  {product.title[currentLocale]}
                </h1>

                <div>
                  <h2 className="sm:text-xl font-bold  mb-2">
                    {currentLocale === "pl" ? "Opis" : "Description"}:
                  </h2>
                  <p className=" whitespace-break-spaces text-[var(--accent-color)]">
                    {product.description[currentLocale]}
                  </p>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">
                  {product.price} zł
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-block px-6 py-3 rounded-full font-bold text-white bg-[var(--brown-color)] hover:bg-[var(--accent-color)] transition-all duration-300 transform hover:scale-105  hover:shadow-xl"
                >
                  {currentLocale === "pl" ? "Kupić" : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={{
            type: "product",
            id: productId,
            title: product.title,
            price: product.price,
            description: product.description,
          }}
        />
      </div>
    </AnimatedSection>
  );
}
