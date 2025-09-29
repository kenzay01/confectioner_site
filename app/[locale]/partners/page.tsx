"use client";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { useState, useEffect } from "react";

interface Partner {
  id: string;
  name: {
    pl: string;
    en: string;
  };
  description: {
    pl: string;
    en: string;
  };
  logo: string;
  website: string;
  isActive: boolean;
}

export default function PartnersPage() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners');
        const data = await response.json();
        // Filter only active partners
        const activePartners = data.filter((partner: Partner) => partner.isActive);
        setPartners(activePartners);
      } catch (error) {
        console.error('Error loading partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          {currentLocale === "pl" ? "Partnerzy" : "Partners"}
        </h1>
        <div className="flex justify-center items-center py-20">
          <div className="text-lg">
            {currentLocale === "pl" ? "Ładowanie..." : "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        {currentLocale === "pl" ? "Partnerzy" : "Partners"}
      </h1>
      {partners.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-600">
            {currentLocale === "pl" 
              ? "Brak aktywnych partnerów" 
              : "No active partners"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <AnimatedSection key={partner.id} className="bg-white rounded-3xl p-6 border border-[var(--brown-color)]/10">
              <div className="w-full h-36 relative mb-4 flex items-center justify-center">
                <Image 
                  src={partner.logo} 
                  alt={partner.name[currentLocale]} 
                  width={220} 
                  height={120} 
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/logo.png'; // fallback image
                  }}
                />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-center">
                {partner.name[currentLocale]}
              </h2>
              <p className="text-gray-600 text-sm text-center mb-4">
                {partner.description[currentLocale]}
              </p>
              {partner.website && (
                <div className="text-center">
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-unified inline-block"
                  >
                    {currentLocale === "pl" ? "Odwiedź stronę" : "Visit website"}
                  </a>
                </div>
              )}
            </AnimatedSection>
          ))}
        </div>
      )}
    </div>
  );
}



