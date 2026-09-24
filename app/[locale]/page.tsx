"use client";
import MainLogoSection from "@/components/homePage/MainLogoSection";
import PolandMapSection from "@/components/homePage/PolandMapSection";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

const HomePage = () => {
  const currentLocale = useCurrentLanguage() as "pl" | "en";

  return (
    <div className="min-h-screen bg-[var(--main-color)] md:pt-0 pt-14 overflow-hidden">
      <MainLogoSection />
      <PolandMapSection />
      <section className="px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200/70">
            <video
              className="w-full h-auto max-h-[80vh] object-contain bg-white"
              src="/ROLKA.mov"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="metadata"
            />
            <div className="px-5 sm:px-8 py-5 sm:py-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--accent-color)] mb-2">
                {currentLocale === "pl"
                  ? "Zobacz atmosferę naszych warsztatów"
                  : "Experience the atmosphere of our masterclasses"}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {currentLocale === "pl"
                  ? "Krótka rolka z zajęć — praktyka, energia i rzemiosło piekarnicze w nowoczesnym wydaniu."
                  : "A short reel from the classes — hands-on practice, energy, and modern artisan baking."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
