"use client";
import { Star, Quote } from "lucide-react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import sweet4 from "@/public/materials/sweet4.png";
import Image from "next/image";
import AnimatedSection from "../AnimatedSection"; // Імпортуйте утилітний компонент

export default function ReviewSection() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);
  const testimonials = dict?.home?.reviews?.testimonials || [];

  return (
    <AnimatedSection className="pb-16 sm:pb-24 bg-[var(--main-color)]">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            {dict?.home?.reviews?.title}
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection
              key={index}
              className="bg-white rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300 relative"
              direction={index % 2 === 0 ? "left" : "right"}
            >
              <Quote className="w-8 h-8 opacity-30 mb-4" />
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
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
