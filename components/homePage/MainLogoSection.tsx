"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import AnimatedSection from "../AnimatedSection";

export default function MainLogoSection() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
        if (videoRef.current) {
          videoRef.current.pause();
          setIsVideoPlaying(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Reset video state on page refresh
    const handleBeforeUnload = () => {
      setHasScrolled(false);
      setIsVideoPlaying(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <AnimatedSection className="flex flex-col min-h-140 items-center pt-8">
      <div className="relative w-102 h-102 mb-8">
        {isVideoPlaying && !hasScrolled ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            webkit-playsinline="true"
            x5-playsinline="true"
            x5-video-player-type="h5"
            x5-video-player-fullscreen="true"
            className="w-full h-full object-contain"
            style={{ animationDelay: '0.5s' }}
            onLoadedData={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(console.error);
              }
            }}
          >
            <source src="/white_BG.mp4" type="video/mp4" />
          </video>
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
