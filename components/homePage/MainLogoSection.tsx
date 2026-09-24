"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AnimatedSection from "../AnimatedSection";
import { useSiteContent } from "@/context/siteContentContext";
import { renderSiteMarkdown } from "@/lib/renderSiteMarkdown";
import { getSiteFontStack } from "@/lib/siteFont";

export default function MainLogoSection() {
  const { content } = useSiteContent();
  const [showStaticLogo, setShowStaticLogo] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStaticLogo(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const cmsFont = { fontFamily: getSiteFontStack(content.fontFamily) };
  const heroRaw = (content.home.heroText ?? "").replace(/\r\n/g, "\n").trimEnd();

  return (
    <AnimatedSection className="flex flex-col min-h-140 items-center pt-8">
      <div className="relative mb-6 sm:mb-8 w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60 mx-auto shrink-0">
        {!showStaticLogo ? (
          <Image
            src="/white_BG.gif"
            alt="Confectioner Masterclasses Animated Logo"
            width={240}
            height={240}
            className="w-full h-full object-contain"
            unoptimized
            priority
            onLoad={() => {
              setTimeout(() => {
                setShowStaticLogo(true);
              }, 7000);
            }}
          />
        ) : (
          <Image
            src="/materials/logo-final.png"
            alt="Confectioner Masterclasses Logo"
            width={240}
            height={240}
            className="w-full h-full object-contain"
            priority
          />
        )}
      </div>
      <h1
        className="text-2xl sm:text-4xl text-center font-normal whitespace-pre-line [&_a]:font-semibold"
        style={cmsFont}
      >
        {renderSiteMarkdown(heroRaw)}
      </h1>
    </AnimatedSection>
  );
}
