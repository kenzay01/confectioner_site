"use client";
import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import sweet3 from "@/public/materials/sweet3.png";
import AnimatedSection from "../AnimatedSection"; // Імпортуйте утилітний компонент

const chefImage = "/chef-photo.jpg";

export default function ExpertSection() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);

  return (
    <AnimatedSection className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12 z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {dict?.home?.expert?.title}
          </h2>
          <h3 className="text-xl sm:text-2xl text-[var(--accent-color)] font-medium">
            {dict?.home?.expert?.subtitle}
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center z-10">
          <AnimatedSection className="relative" direction="left">
            <div className="aspect-square rounded-3xl overflow-hidden">
              <Image
                src={chefImage}
                alt="Chef Yaroslav Semkiv"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </AnimatedSection>

          <AnimatedSection className="space-y-6 z-10 mb-28" direction="right">
            <p className="text-lg sm:text-xl text-[var(--accent-color)] leading-relaxed">
              {dict?.home?.expert?.description}
            </p>
            <div className="p-6 bg-[var(--brown-color)]/5 rounded-2xl border-l-4 border-[var(--brown-color)]">
              <p className="text-lg font-medium">
                {dict?.home?.expert?.limitedSeats}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </AnimatedSection>
  );
}
