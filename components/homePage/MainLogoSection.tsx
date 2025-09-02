import { motion } from "framer-motion";
import Image from "next/image";
import logo from "@/public/logo-removebg-preview.png";
import AnimatedSection from "../AnimatedSection"; // Імпортуйте утилітний компонент

export default function MainLogoSection() {
  return (
    <AnimatedSection className="flex flex-col min-h-140 items-center pt-8">
      <Image
        src={logo}
        alt="Confectioner Logo"
        width={1000}
        height={1000}
        className="w-102 h-auto"
      />
      <h1 className="text-2xl sm:text-4xl text-center ">
        Warsztaty <br /> z <br /> nowoczesnego piekarnictwa
      </h1>
    </AnimatedSection>
  );
}
