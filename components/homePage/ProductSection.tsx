"use client";

import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useDictionary } from "@/hooks/getDictionary";
import { Locale } from "@/i18n/config";
import sweet5 from "@/public/materials/sweet5.png";
import sweet6 from "@/public/materials/sweet6.png";
// Placeholder image - replace with actual book cover image
const bookCover = "/book-cover.jpg"; // Add your book cover

export default function ProductSection() {
  const currentLocale = useCurrentLanguage();
  const { dict } = useDictionary(currentLocale as Locale);
  return (
    <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-4">
            {dict?.home?.products?.title}
          </h2>
        </div>
        {/* <Image
          src={sweet5}
          alt="Sweet 5"
          width={400}
          height={400}
          className="absolute z-15 -left-40 lg:-left-55 lg:top-50 xl:top-40 -rotate-12 drop-shadow-2xl w-48 h-48 sm:w-68 sm:h-68 xl:w-92 xl:h-92"
        />
        <Image
        src={sweet6}
        alt="Sweet 6"
        width={400}
          height={400}
          className="absolute z-15 -right-40 lg:-right-55 lg:top-20 xl:top-10 rotate-12 drop-shadow-2xl w-48 h-48 sm:w-68 sm:h-68 xl:w-92 xl:h-92"
        /> */}

        <div className="relative max-w-4xl mx-auto z-10">
          <Image
            src={sweet5}
            alt="Sweet 1"
            width={400}
            height={400}
            className="absolute -left-46 z-5 top-20 drop-shadow-2xl w-92 h-auto"
            sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
            placeholder="blur"
            quality={75}
          />
          <Image
            src={sweet6}
            alt="Sweet 2"
            width={400}
            height={400}
            className="absolute -right-46 z-5 top-0 drop-shadow-2xl w-92 h-auto"
            sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
            placeholder="blur"
            quality={75}
          />
          <div className="relative z-20 bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-[var(--brown-color)]/10 hover:shadow-3xl transition-shadow duration-300">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={bookCover}
                    alt="Tłusty czwartek book cover"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-[var(--brown-color)]">
                  {dict?.home?.products?.book?.title}
                </h3>
                <p className="text-lg text-[var(--accent-color)] leading-relaxed">
                  {dict?.home?.products?.book?.description}
                </p>
                <button className="bg-[var(--brown-color)] hover:bg-[var(--accent-color)] text-white font-bold text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  {dict?.home?.products?.book?.buyButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
