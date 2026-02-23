"use client";

import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import Image from "next/image";
import { useSiteContent } from "@/context/siteContentContext";
import AnimatedSection from "../AnimatedSection";

export default function HomeIntroSection() {
  const locale = useCurrentLanguage() as "pl" | "en";
  const { content } = useSiteContent();
  const intro = locale === "pl" ? content.home.introPl : content.home.introEn;
  const paragraphs = intro.split("\n\n").filter((p) => p.trim() !== "");

  if (paragraphs.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <AnimatedSection className="relative group" direction="left">
          <Image
            src={content.home.introImage || "/slavik.jpg"}
            alt={locale === "pl" ? "Szef Jarosław Semkiw" : "Chef Yaroslav Semkiv"}
            width={400}
            height={600}
            className="relative rounded-lg object-cover w-full h-[400px] sm:h-[500px] lg:h-[600px] transition-transform duration-300 group-hover:scale-[1.02]"
            placeholder="blur"
            blurDataURL="/placeholder.jpg"
          />
        </AnimatedSection>
        <AnimatedSection className="bg-white/95 backdrop-blur-sm rounded-3xl p-6" direction="right">
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-800">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
