"use client";

import { Star, Quote } from "lucide-react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import sweet4 from "@/public/materials/sweet4.png";
import Image from "next/image";

export default function ReviewSection() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);
  const testimonials = dict?.home?.reviews?.testimonials || [];

  return (
    <section className="pb-16 sm:pb-24 bg-[var(--main-color)]">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-4">
            {dict?.home?.reviews?.title}
          </h2>
        </div>

        <Image
          src={sweet4}
          alt="Sweet 4"
          width={400}
          height={400}
          className="hidden lg:flex absolute z-15 xl:left-90 lg:left-110 lg:top-50 xl:top-40 -rotate-12 drop-shadow-2xl w-48 h-48 sm:w-68 sm:h-68 xl:w-92 xl:h-92"
          sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
          placeholder="blur"
          quality={75}
        />

        <div className="grid sm:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
            >
              <Quote className="w-8 h-8 text-[var(--brown-color)] opacity-30 mb-4" />
              <p className="text-[var(--accent-color)] text-lg leading-relaxed mb-6">
                &quot;{testimonial}&quot;
              </p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
