"use client";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import Image from "next/image";
import Link from "next/link";
import AnimatedSection from "@/components/AnimatedSection";
import { useSiteContent } from "@/context/siteContentContext";

export default function AboutMe() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { content } = useSiteContent();
  const block = content.about[currentLocale];
  const contactLinkWord = currentLocale === "pl" ? "KONTAKT" : "CONTACT";
  const parts = block.contactText.split(contactLinkWord);

  return (
    <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
          {block.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatedSection
            className="relative group mt-8 sm:mt-10 lg:mt-12"
            direction="left"
          >
            <Image
              src={content.aboutImage || "/slavik.jpg"}
              alt={
                currentLocale === "pl"
                  ? "Szef Jarosław Semkiw"
                  : "Chef Yaroslav Semkiv"
              }
              width={400}
              height={600}
              className="relative rounded-lg object-cover w-full h-[500px] sm:h-[600px] lg:h-[700px] transition-transform duration-300 group-hover:scale-[1.02]"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
          </AnimatedSection>

          <AnimatedSection
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-6"
            direction="right"
          >
            <div className="space-y-5 text-base sm:text-lg leading-relaxed text-gray-700">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {block.greeting}
              </h2>
              {block.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              <p className="mt-6 font-semibold text-gray-900">
                {parts[0]}
                <Link
                  href={`/${currentLocale}/contacts`}
                  className="underline hover:text-[var(--accent-color)] transition-colors"
                >
                  {contactLinkWord}
                </Link>
                {parts[1] || ""}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
