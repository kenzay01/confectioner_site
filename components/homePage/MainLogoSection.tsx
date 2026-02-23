"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AnimatedSection from "../AnimatedSection";
import { useSiteContent } from "@/context/siteContentContext";

export default function MainLogoSection() {
  const { content } = useSiteContent();
  const [showStaticLogo, setShowStaticLogo] = useState(false);
  const gifRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStaticLogo(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  const heroLines = content.home.heroText.split("\n");

  return (
    <AnimatedSection className="flex flex-col min-h-140 items-center pt-8">
      <div className="relative w-102 h-102 mb-8">
        {!showStaticLogo ? (
          <img
            ref={gifRef}
            src="/white_BG.gif"
            alt="Confectioner Masterclasses Animated Logo"
            width={400}
            height={400}
            className="w-full h-full object-contain"
            style={{ display: "block" }}
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
            width={400}
            height={400}
            className="w-full h-full object-contain"
            priority
          />
        )}
      </div>
      <h1 className="text-2xl sm:text-4xl text-center ">
        {heroLines.map((line: string, i: number) => (
          <span key={i}>
            {line}
            {i < heroLines.length - 1 && <br />}
          </span>
        ))}
      </h1>
    </AnimatedSection>
  );
}
