"use client";

import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddedToCartModal({ isOpen, onClose }: Props) {
  const currentLocale = useCurrentLanguage() as "pl" | "en";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 pt-2">
          <div className="w-14 h-14 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7 text-[var(--accent-color)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--accent-color)]">
            {currentLocale === "pl"
              ? "Dodano do koszyka"
              : "Added to cart"}
          </h2>
          <p className="text-[var(--accent-color)]/80">
            {currentLocale === "pl"
              ? "Co chcesz zrobić dalej?"
              : "What would you like to do next?"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-medium hover:bg-[var(--accent-color)]/5 transition-colors"
            >
              {currentLocale === "pl"
                ? "Kontynuuj zakupy"
                : "Continue shopping"}
            </button>
            <Link
              href={`/${currentLocale}/cart`}
              onClick={onClose}
              className="flex-1 btn-unified px-4 py-3 text-center"
            >
              {currentLocale === "pl"
                ? "Przejdź do koszyka"
                : "Go to cart"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
