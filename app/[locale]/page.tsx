"use client";
import HeroBanner from "@/components/homePage/HeroBanner";
import ExpertSection from "@/components/homePage/ExpertSection";
import ReviewSection from "@/components/homePage/ReviewSection";
import ProductSection from "@/components/homePage/ProductSection";
import MainLogoSection from "@/components/homePage/MainLogoSection";
import Footer from "@/components/homePage/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[var(--main-color)] md:pt-0 pt-14 overflow-hidden">
      <MainLogoSection />
      <HeroBanner />
      <ExpertSection />
      <ReviewSection />
      <ProductSection />
    </div>
  );
};

export default HomePage;
