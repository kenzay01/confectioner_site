"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AnimatedSection from "../AnimatedSection";

export default function MainLogoSection() {
  const [showStaticLogo, setShowStaticLogo] = useState(false);
  const gifRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Чекаємо 7 секунд (тривалість GIF анімації) перед заміною на статичне фото
    const timer = setTimeout(() => {
      setShowStaticLogo(true);
    }, 7000); // 7 секунд - тривалість анімації GIF

    return () => clearTimeout(timer);
  }, []);

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
            style={{ display: 'block' }}
            onLoad={() => {
              // Після завантаження GIF чекаємо 7 секунд (тривалість анімації), потім замінюємо на статичне фото
              setTimeout(() => {
                setShowStaticLogo(true);
              }, 7000); // 7 секунд - тривалість анімації GIF
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
        Szkolenia <br /> z <br /> nowoczesnego piekarnictwa
      </h1>
    </AnimatedSection>
  );
}
