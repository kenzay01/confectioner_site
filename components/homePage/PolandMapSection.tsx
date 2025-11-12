"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useItems } from "@/context/itemsContext";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import AnimatedSection from "@/components/AnimatedSection";
import { X, MapPin, Calendar } from "lucide-react";

// Leaflet types
interface LeafletMap {
  setMaxBounds: (bounds: [[number, number], [number, number]]) => void;
  addTo: (map: LeafletMap) => LeafletMap;
}

interface LeafletTileLayer {
  addTo: (map: LeafletMap) => LeafletTileLayer;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (content: string) => LeafletMarker;
  bindTooltip: (content: string, options?: Record<string, unknown>) => LeafletMarker;
  on: (event: string, handler: (e?: { originalEvent: Event }) => void) => LeafletMarker;
}

interface LeafletIcon {
  iconUrl?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
  shadowUrl?: string;
  shadowSize?: [number, number];
  shadowAnchor?: [number, number];
}

interface LeafletDivIcon {
  html?: string;
  className?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
}

declare global {
  interface Window {
    L: {
      map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMap;
      tileLayer: (url: string, options?: Record<string, unknown>) => LeafletTileLayer;
      marker: (latlng: [number, number], options?: Record<string, unknown>) => LeafletMarker;
      icon: (options: Record<string, unknown>) => LeafletIcon;
      divIcon: (options: Record<string, unknown>) => LeafletDivIcon;
    };
    selectCity?: (cityName: string) => void;
  }
}

// Завантажуємо координати міст Польщі
const loadPolishCities = async () => {
  try {
    console.log('Loading cities from API...');
    const response = await fetch('/api/cities');
    console.log('Cities API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cities = await response.json();
    console.log('Loaded cities:', cities.length);
    return cities;
  } catch (error) {
    console.error('Error loading cities:', error);
    return [];
  }
};

export default function PolandMapSection() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [polishCities, setPolishCities] = useState<Array<{name: string, lat: number, lng: number}>>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const currentLocale = useCurrentLanguage();
  const { masterclasses, loading } = useItems();
  const handleScrollToMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Список доступних фото з папки materials (PNG з прозорим фоном)
  const materialImages = [
    "/materials/Donut png без фона.png",
    "/materials/Donut PNG.png",
    "/materials/sweet1.png",
    "/materials/sweet2.png",
    "/materials/sweet3.png",
    "/materials/sweet4.png",
    "/materials/sweet5.png",
    "/materials/sweet6.png"
  ];

  // Функція для отримання випадкового фото
  const getRandomImage = (masterclassId: string, city?: string) => {
    // Використовуємо ID майстер-класу та місто як seed для стабільності
    const combinedSeed = masterclassId + (city || '');
    const seed = combinedSeed.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(seed) % materialImages.length;
    const selectedImage = materialImages[index];
    console.log(`Selected image for ${masterclassId} (${city}): ${selectedImage}`);
    return selectedImage;
  };

  // Завантаження Leaflet та міст
  useEffect(() => {
    const loadData = async () => {
      // Завантажуємо міста
      const cities = await loadPolishCities();
      setPolishCities(cities);

      // Завантажуємо Leaflet
      if (typeof window !== 'undefined' && !window.L) {
        // Завантажуємо CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        // Завантажуємо JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = () => setLeafletLoaded(true);
        document.head.appendChild(script);
      } else if (window.L) {
        setLeafletLoaded(true);
      }
    };

    loadData();
  }, []);

  // Ініціалізація карти
  useEffect(() => {
    if (leafletLoaded && mapRef.current && !map) {
      const L = window.L;
      
      // Додаємо глобальну функцію для обробки кліків
      window.selectCity = (cityName: string) => {
        console.log('Global click handler:', cityName);
        setSelectedCity(prevSelected => prevSelected === cityName ? null : cityName);
      };
      
      const mapInstance = L.map(mapRef.current, {
        center: [51.9194, 19.1451], // Центр Польщі
        zoom: 6.2,
        scrollWheelZoom: true,
        zoomControl: true,
        maxBounds: [
          [48.8, 14.0], // Більш точні межі для Польщі
          [55.2, 24.2]  // Північно-східний кут
        ],
        maxBoundsViscosity: 1.0, // Не дозволяємо вийти за межі
        minZoom: 6,
        maxZoom: 9
      });

      // Додатково обмежуємо переміщення карти
      mapInstance.setMaxBounds([
        [48.8, 14.0],
        [55.2, 24.2]
      ]);

      // Додаємо мінімалістичні тайли CartoDB
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 18,
        subdomains: 'abcd',
        accessToken: null
      }).addTo(mapInstance);

      // Додаємо маркери міст на основі майстер-класів
      masterclasses.forEach((masterclass) => {
        if (!masterclass.city) return;
        
        // Знаходимо координати міста
        const cityData = polishCities.find(city => city.name === masterclass.city);
        if (!cityData) return;

        // Створюємо custom HTML маркер у вигляді піна локації
        const markerHtml = `
          <div class="custom-marker-container" style="position: relative;">
            <div class="pulse-ring" style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: rgba(80, 45, 28, 0.15);
              animation: pulse 2s infinite;
            "></div>
            <div class="marker-content" style="
              position: relative;
              z-index: 10;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s ease;
              filter: drop-shadow(0 6px 20px rgba(0,0,0,0.25));
            " onclick="window.selectCity('${masterclass.city}')">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="pointer-events: none;">
                <path d="M12 2C8.13401 2 5 5.13401 5 9C5 13.25 9.5 18.5 11.29 20.46C11.68 20.89 12.32 20.89 12.71 20.46C14.5 18.5 19 13.25 19 9C19 5.13401 15.866 2 12 2Z" fill="var(--brown-color)"/>
                <circle cx="12" cy="9" r="3" fill="white"/>
              </svg>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        const marker = L.marker([cityData.lat, cityData.lng], { icon: customIcon })
          .addTo(mapInstance)
          .on('click', (e?: { originalEvent: Event }) => {
            if (e && e.originalEvent) {
              e.originalEvent.stopPropagation();
            }
            console.log('Leaflet click on city:', masterclass.city);
            setSelectedCity(prevSelected => prevSelected === masterclass.city ? null : masterclass.city);
          })
          .on('mousedown', (e?: { originalEvent: Event }) => {
            if (e && e.originalEvent) {
              e.originalEvent.stopPropagation();
            }
          });

        // Додаємо tooltip в стилі сайту
        marker.bindTooltip(masterclass.city, {
          permanent: false,
          direction: 'top',
          className: 'custom-tooltip',
        });
      });

      // Додаємо CSS для анімації в стилі сайту
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
        .custom-leaflet-marker {
          background: none !important;
          border: none !important;
        }
        .custom-tooltip {
          background: var(--brown-color) !important;
          color: white !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 12px 18px !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          box-shadow: 0 8px 25px rgba(80, 45, 28, 0.3) !important;
        }
        .custom-tooltip:before { border-top-color: var(--brown-color) !important; }
        .marker-content:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 8px 25px rgba(80, 45, 28, 0.4));
        }
        .marker-content:active {
          transform: scale(1.02);
        }
        .custom-leaflet-marker {
          pointer-events: auto !important;
        }
        .leaflet-control-zoom {
          border-radius: 16px !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
          border: 2px solid var(--brown-color) !important;
        }
        .leaflet-control-zoom a {
          border-radius: 12px !important;
          background: white !important;
          color: var(--brown-color) !important;
          font-weight: 700 !important;
          transition: all 0.3s ease !important;
        }
        .leaflet-control-zoom a:hover {
          background: var(--brown-color) !important;
          color: white !important;
          transform: scale(1.05) !important;
        }
      `;
      document.head.appendChild(style);

      setMap(mapInstance);
    }

    // Cleanup глобальної функції при розмонтуванні
    return () => {
      if (window.selectCity) {
        delete window.selectCity;
      }
    };
  }, [leafletLoaded, map, selectedCity, masterclasses, polishCities]);

  const getSelectedMasterclass = () => {
    if (!selectedCity) return null;
    return masterclasses.find(mc => mc.city === selectedCity);
  };

  const selectedMasterclass = getSelectedMasterclass();

  if (loading) {
    return (
      <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Завантаження...</p>
          </div>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-white mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center mb-16">
          <div className="order-2 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--brown-color)] mb-4">
              {currentLocale === "pl" ? "Poznaj prowadzącego" : "Meet the trainer"}
            </p>
            <div className="space-y-4 text-base sm:text-lg text-gray-700 leading-relaxed">
              <p>
                {currentLocale === "pl"
                  ? "Mam na imię Jarek i pomagam piekarzom oraz pasjonatom odkrywać prawdziwe rzemiosło piekarnicze."
                  : "My name is Jarek and I help bakers and enthusiasts discover true artisan baking."}
              </p>
              <p>
                {currentLocale === "pl"
                  ? "Podczas moich szkoleń uczę, jak pracować z naturalnym zakwasem, jak prowadzić fermentację w czasie i jak tworzyć ciasta francuskie i półfrancuskie, które zachwycają strukturą i aromatem."
                  : "During my trainings I teach how to work with natural sourdough, manage fermentation over time and craft laminated doughs that impress with structure and aroma."}
              </p>
              <p>
                {currentLocale === "pl"
                  ? "Moje warsztaty to nie tylko wiedza technologiczna – to praktyka, doświadczenie i pasja do prostych, naturalnych składników."
                  : "My workshops are more than technical knowledge – they are practice, experience and passion for simple, natural ingredients."}
              </p>
              <p>
                {currentLocale === "pl"
                  ? "Dołącz do grona piekarzy, którzy wprowadzili do swoich pracowni naturalne, długo fermentowane pieczywo."
                  : "Join the bakers who have introduced naturally long-fermented breads into their bakeries."}
              </p>
            </div>
            <p className="mt-6 text-2xl font-semibold text-gray-900">
              Rzemiosło piekarnicze,
              <br />
              które buduje charakter
            </p>
            <button
              type="button"
              onClick={handleScrollToMap}
              className="inline-flex items-center gap-2 text-base sm:text-lg font-semibold text-[var(--brown-color)] hover:text-[var(--accent-color)] transition-colors mt-6"
            >
              <span role="img" aria-hidden="true">👉</span>
              <span className="text-center lg:text-left">
                {currentLocale === "pl"
                  ? "Sprawdź, w jakich miastach odbyły się już moje szkolenia."
                  : "See which cities have already hosted my trainings."}
              </span>
            </button>
          </div>
          <div className="order-1 lg:order-2 relative w-full aspect-[4/5] overflow-hidden rounded-3xl shadow-xl border border-gray-200">
            <Image
              src="/materials/yarek.jpg"
              alt="Jarek prowadzący szkolenia piekarnicze"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 480px"
              priority
            />
          </div>
        </div>

        {/* Real Map Container */}
        <div className="relative mb-12 z-0" id="poland-map">
          <div 
            ref={mapRef}
            className="w-full h-96 sm:h-[500px] rounded-2xl shadow-xl border border-gray-200 overflow-hidden relative z-0"
            style={{ minHeight: '400px', isolation: 'isolate' }}
          />
          
          {!leafletLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Завантаження карти...</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Alert for Masterclass Details */}
        {selectedMasterclass && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
            <AnimatedSection 
              className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border-l-4 border-[var(--brown-color)] shadow-2xl"
              direction="up"
              duration={0.3}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCity(null)}
                className="absolute top-4 right-4 btn-unified p-2 rounded-full z-10"
              >
                <X className="w-6 h-6 text-gray-500 hover:text-[var(--brown-color)]" />
              </button>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Section */}
                <div className="lg:w-2/5">
                  <div className="relative group flex items-center justify-center">
                    <Image
                      src={getRandomImage(selectedMasterclass.id, selectedMasterclass.city)}
                      alt={selectedMasterclass.title[currentLocale as keyof typeof selectedMasterclass.title]}
                      width={300}
                      height={300}
                      className="object-contain max-h-80 w-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/materials/Donut png без фона.png"; // fallback image
                      }}
                    />
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="lg:w-3/5">
                  {/* Title */}
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-[var(--brown-color)]/10 text-[var(--brown-color)] mb-3">
                      {currentLocale === "pl" ? "Masterclass" : "Masterclass"}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight">
                      {selectedMasterclass.title[currentLocale as keyof typeof selectedMasterclass.title]}
                    </h3>
                  </div>
                  
                  {/* Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="p-2 bg-[var(--brown-color)]/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-[var(--brown-color)]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {currentLocale === "pl" ? "Lokalizacja" : "Location"}
                        </p>
                        <p className="text-gray-800 font-bold">{selectedMasterclass.location[currentLocale as keyof typeof selectedMasterclass.location]}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="p-2 bg-[var(--accent-color)]/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-[var(--accent-color)]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">
                          {currentLocale === "pl" ? "Data" : "Date"}
                        </p>
                        <p className="text-gray-800 font-bold text-sm">
                          {new Date(selectedMasterclass.date).toLocaleDateString(currentLocale)} - {" "}
                          {new Date(selectedMasterclass.dateEnd || selectedMasterclass.date).toLocaleDateString(currentLocale)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  
                  {/* Description */}
                  <div className="bg-gray-50 p-4 rounded-xl max-h-32 overflow-y-auto mb-6 border border-gray-100">
                    <div className="text-gray-700 leading-relaxed">
                      {selectedMasterclass.description[currentLocale as keyof typeof selectedMasterclass.description].split('\\n').slice(0, 3).map((paragraph: string, index: number) => (
                        <p key={index} className="mb-2 text-sm">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                </div>
              </div>
            </AnimatedSection>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}