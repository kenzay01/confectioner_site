"use client";
import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import AnimatedSection from "../AnimatedSection"; // Імпортуйте утилітний компонент

const bookCover = "/book-cover.jpg";

export default function ProductSection() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);
  return (
    <AnimatedSection className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {dict?.home?.products?.title}
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto z-10">
          <div className="relative z-20 bg-white rounded-3xl p-8 sm:p-12 hover:shadow-3xl transition-shadow duration-300">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <AnimatedSection className="relative" direction="left">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src={bookCover}
                    alt="Tłusty czwartek book cover"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection className="space-y-6" direction="right">
                <h3 className="text-2xl sm:text-3xl font-bold">
                  {dict?.home?.products?.book?.title}
                </h3>
                <p className="text-lg text-[var(--accent-color)] leading-relaxed">
                  {dict?.home?.products?.book?.description}
                </p>
                <button className="btn-unified text-lg px-8 py-3">
                  {dict?.home?.products?.book?.buyButton}
                </button>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
