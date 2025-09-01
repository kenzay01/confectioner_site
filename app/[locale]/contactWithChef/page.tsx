"use client";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import Link from "next/link";
import Image from "next/image";
import sweet1 from "@/public/materials/bread1.png";
import sweet2 from "@/public/materials/cruasan.png";
import AnimatedSection from "@/components/AnimatedSection";

export default function ContactChef() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";

  return (
    <AnimatedSection className="relative md:pt-0 pt-14 bg-[var(--main-color)] flex justify-center items-center min-h-140 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* <Image
          src={sweet1}
          alt="Sweet 1"
          width={400}
          height={400}
          className="absolute -left-25 sm:-left-40 lg:-left-85 z-0 rotate-15 top-15 md:top-20 lg:top-15 drop-shadow-2xl w-48 h-48 sm:w-68 sm:h-68 lg:w-92 lg:h-92"
          sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
          placeholder="blur"
          quality={75}
        />
        <Image
          src={sweet2}
          alt="Sweet 2"
          width={400}
          height={400}
          className="absolute -right-20 sm:-right-40 lg:-right-75 z-15 rotate-10 bottom-0 md:bottom-20 lg:bottom-0 drop-shadow-2xl w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96"
          sizes="100vw (max-width: 600px) 48vw, (max-width: 1024px) 28vw, 23vw"
          placeholder="blur"
          quality={75}
        /> */}
        <h1 className="text-3xl sm:text-4xl font-bold  mb-8 text-center">
          {currentLocale === "pl"
            ? "Chcę skontaktować się z Szefem"
            : "I Want to Contact the Chef"}
        </h1>
        <div className="z-25 max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-6 ">
          <p className=" mb-4 z-20">
            {currentLocale === "pl"
              ? "Jestem zawsze otwarty na pytania, konsultacje i nowe współprace."
              : "I’m always open to questions, consultations, and new collaborations."}
          </p>
          <p className=" mb-6 z-20">
            {currentLocale === "pl"
              ? "Napisz, a na pewno znajdziemy format, który będzie odpowiedni właśnie dla Ciebie."
              : "Write to me, and we’ll surely find a format that suits you."}
          </p>
          <Link
            href={`/${currentLocale}/contacts`}
            className="inline-block px-6 py-3 rounded-full font-bold text-white bg-[var(--brown-color)] hover:bg-[var(--accent-color)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {currentLocale === "pl" ? "Skontaktuj się" : "Get in Touch"}
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
