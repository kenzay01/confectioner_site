"use client";
import MainLogoSection from "@/components/homePage/MainLogoSection";
import PolandMapSection from "@/components/homePage/PolandMapSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[var(--main-color)] md:pt-0 pt-14 overflow-hidden">
      <MainLogoSection />
      <PolandMapSection />
    </div>
  );
};

export default HomePage;
