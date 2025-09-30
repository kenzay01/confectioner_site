"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import AnimatedSection from "../AnimatedSection";

export default function MainLogoSection() {
  const [showStaticLogo, setShowStaticLogo] = useState(false);

  useEffect(() => {
    // Автоматично перемикаємось на статичний логотип через 3 секунди (час анімації GIF)
    const timer = setTimeout(() => {
      setShowStaticLogo(true);
    }, 3000); // Змініть час відповідно до тривалості вашого GIF

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowStaticLogo(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatedSection className="flex flex-col min-h-140 items-center pt-8">
      <div className="relative w-102 h-102 mb-8">
        {!showStaticLogo ? (
          <Image
            src="/white_BG.gif"
            alt="Confectioner Masterclasses Animated Logo"
            width={400}
            height={400}
            className="w-full h-full object-contain"
            priority
            unoptimized
          />
        ) : (
          <Image
            src="/logo.png"
            alt="Confectioner Masterclasses Logo"
            width={400}
            height={400}
            className="w-full h-full object-contain"
            priority
          />
        )}
      </div>
      <h1 className="text-2xl sm:text-4xl text-center ">
        Szkolenia <br /> z <br /> nowoczesnego piekarnictwa
      </h1>
    </AnimatedSection>
  );
}
