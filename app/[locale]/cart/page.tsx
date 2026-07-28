"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useCart } from "@/context/cartContext";
import PaymentModal from "@/components/PaymentModal";
import AnimatedSection from "@/components/AnimatedSection";

export default function CartPage() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { items, totalPrice, setQuantity, removeItem, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <AnimatedSection className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="w-7 h-7 text-[var(--accent-color)]" />
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--accent-color)]">
            {currentLocale === "pl" ? "Koszyk" : "Cart"}
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200/60">
            <p className="text-[var(--accent-color)] text-lg mb-6">
              {currentLocale === "pl"
                ? "Twój koszyk jest pusty"
                : "Your cart is empty"}
            </p>
            <Link
              href={`/${currentLocale}/masterClass`}
              className="btn-unified inline-block px-6 py-3"
            >
              {currentLocale === "pl"
                ? "Zobacz warsztaty"
                : "Browse workshops"}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200/60 flex gap-4"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    {item.photo ? (
                      <Image
                        src={item.photo}
                        alt={item.title[currentLocale]}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        {currentLocale === "pl" ? "Brak" : "N/A"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-[var(--accent-color)] text-lg leading-snug">
                        {item.title[currentLocale]}
                      </h2>
                      <p className="text-[var(--brown-color)] font-bold mt-1">
                        {item.price} zł
                        {item.quantity > 1 ? (
                          <span className="text-sm font-medium text-gray-500 ml-2">
                            = {item.price * item.quantity} zł
                          </span>
                        ) : null}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Decrease"
                          onClick={() =>
                            setQuantity(item.type, item.id, item.quantity - 1)
                          }
                          className="w-9 h-9 rounded-full border-2 border-[var(--accent-color)] flex items-center justify-center hover:bg-[var(--accent-color)]/10"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase"
                          disabled={
                            item.maxQuantity != null &&
                            item.quantity >= item.maxQuantity
                          }
                          onClick={() =>
                            setQuantity(item.type, item.id, item.quantity + 1)
                          }
                          className="w-9 h-9 rounded-full border-2 border-[var(--accent-color)] flex items-center justify-center hover:bg-[var(--accent-color)]/10 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.type, item.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        aria-label={
                          currentLocale === "pl" ? "Usuń" : "Remove"
                        }
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium text-[var(--accent-color)]">
                  {currentLocale === "pl" ? "Suma" : "Total"}
                </span>
                <span className="text-2xl font-bold text-[var(--brown-color)]">
                  {totalPrice} zł
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full btn-unified py-3 text-lg"
              >
                {currentLocale === "pl" ? "Przejdź do płatności" : "Checkout"}
              </button>
              <Link
                href={`/${currentLocale}/masterClass`}
                className="block text-center mt-4 text-[var(--accent-color)] underline underline-offset-2"
              >
                {currentLocale === "pl"
                  ? "Kontynuuj zakupy"
                  : "Continue shopping"}
              </Link>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={items.map((i) => ({
          type: i.type,
          id: i.id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        }))}
        onPaymentCreated={clearCart}
      />
    </AnimatedSection>
  );
}
