"use client";
import HeroBanner from "@/components/homePage/HeroBanner";
import ExpertSection from "@/components/homePage/ExpertSection";
import ReviewSection from "@/components/homePage/ReviewSection";
import ProductSection from "@/components/homePage/ProductSection";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[var(--main-color)] md:pt-0 pt-14">
      <HeroBanner />
      <ExpertSection />
      <ReviewSection />
      <ProductSection />
    </div>
  );
};

export default HomePage;
