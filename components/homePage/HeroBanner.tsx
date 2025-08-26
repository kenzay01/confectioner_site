"use client";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import sweet1 from "@/public/materials/sweet1.png";
import sweet2 from "@/public/materials/sweet2.png";
export default function HeroBanner() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);

  return (
    <section className="relative h-150 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[var(--main-color)] relative">
          {/* You can replace this with an actual background image */}
          <div className="absolute inset-0 bg-[url('/baking-hero.jpg')] bg-cover bg-center opacity-30"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[500px] bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 lg:p-16 shadow-lg border border-[var(--brown-color)]/10 flex flex-col justify-center">
          <Image
            src={sweet1}
            alt="Sweet 1"
            width={400}
            height={400}
            className="absolute -left-25 sm:-left-40 lg:-left-55 z-15 rotate-40 bottom-15 md:bottom-20 lg:bottom-10 drop-shadow-2xl w-48 h-48 sm:w-68 sm:h-68 lg:w-92 lg:h-92"
            sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
            placeholder="blur"
            quality={75}
          />
          <Image
            src={sweet2}
            alt="Sweet 2"
            width={400}
            height={400}
            className="absolute -right-20 sm:-right-40 lg:-right-55 z-15 rotate-25 top-30 md:top-20 lg:top-10 drop-shadow-2xl w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96"
            sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
            placeholder="blur"
            quality={75}
          />
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-[var(--brown-color)] mb-6 leading-tight">
            {dict?.home?.banner?.title || "Bake with the Best!"}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-md md:text-lg text-[var(--accent-color)]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                {dict?.home?.banner?.date || "Date not available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                {dict?.home?.banner?.location || "Location not available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                {dict?.home?.banner?.forAllLevels || "For all skill levels"}
              </span>
            </div>
          </div>
          <div className="mb-8">
            <span className="text-4xl sm:text-5xl font-bold text-[var(--brown-color)]">
              {dict?.home?.banner?.price || "Price not available"}
            </span>
          </div>
          <button className="bg-[var(--brown-color)] hover:bg-[var(--accent-color)] text-white font-bold text-xl px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            {dict?.home?.banner?.bookButton || "Book Now"}
          </button>
        </div>
      </div>
    </section>
  );
}
