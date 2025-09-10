import { motion } from "framer-motion";
import AnimatedSection from "../AnimatedSection";

export default function MainLogoSection() {
  return (
    <AnimatedSection className="flex flex-col min-h-140 items-center pt-8">
      <div className="relative w-102 h-102 mb-8">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain"
        >
          <source src="/white_BG.mp4" type="video/mp4" />
        </video>
      </div>
      <h1 className="text-2xl sm:text-4xl text-center ">
        Szkolenia <br /> z <br /> nowoczesnego piekarnictwa
      </h1>
    </AnimatedSection>
  );
}
