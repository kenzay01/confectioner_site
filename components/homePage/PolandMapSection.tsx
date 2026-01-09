"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import AnimatedSection from "@/components/AnimatedSection";
import { X, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { MapLocation } from "@/types/mapLocation";
import { getCityName } from "@/utils/cityTranslations";

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
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([]);
  const [photoGallery, setPhotoGallery] = useState<{
    photos: string[];
    index: number;
    title: string;
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const currentLocale = useCurrentLanguage();
  const handleScrollToMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Ładowanie Leaflet, listy miast oraz punktów na mapie
  useEffect(() => {
    const loadData = async () => {
      const cities = await loadPolishCities();
      setPolishCities(cities);

      try {
        const locationsRes = await fetch('/api/map-locations');
        if (locationsRes.ok) {
          const locationsData = await locationsRes.json();
          setMapLocations(locationsData);
        }
      } catch (error) {
        console.error('Error loading map locations:', error);
      }

      if (typeof window !== 'undefined' && !window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

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
      
      window.selectCity = (cityName: string) => {
        console.log('Global click handler:', cityName);
        setSelectedCity(prevSelected => prevSelected === cityName ? null : cityName);
      };
      
      const mapInstance = L.map(mapRef.current, {
        center: [52.2, 19.2],
        zoom: 6.6,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: false,
        // Granice skupione ściśle na Polsce
        maxBounds: [
          [49.0, 14.0], // południowo-zachodni narożnik
          [55.0, 24.2], // północno-wschodni narożnik
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 6.2,
        maxZoom: 10
      });

      mapInstance.setMaxBounds([
        [49.0, 14.0],
        [55.0, 24.2]
      ]);

      // OpenStreetMap Standard (lokalne nazwy miast, bezpłatne)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      const citiesWithLocations = new Set(mapLocations.filter(loc => loc.city).map(loc => loc.city));
        
      citiesWithLocations.forEach((cityName) => {
        const cityData = polishCities.find(city => city.name === cityName);
        if (!cityData) return;

        const locationCount = mapLocations.filter(loc => loc.city === cityName).length;

        const translatedCityName = getCityName(cityName, currentLocale);

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
            " onclick="window.selectCity('${cityName}')">
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
            console.log('Leaflet click on city:', cityName);
            setSelectedCity(prevSelected => prevSelected === cityName ? null : cityName);
          })
          .on('mousedown', (e?: { originalEvent: Event }) => {
            if (e && e.originalEvent) {
              e.originalEvent.stopPropagation();
            }
          });

        let tooltipText = translatedCityName;
        if (locationCount > 0) {
          tooltipText = `${translatedCityName} (${locationCount} ${currentLocale === 'pl' ? 'miejsc' : 'places'})`;
        }

        marker.bindTooltip(tooltipText, {
          permanent: false,
          direction: 'top',
          className: 'custom-tooltip',
        });
      });

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
          border-radius: 999px !important;
          box-shadow: 0 4px 14px rgba(0,0,0,0.12) !important;
          border: 1px solid rgba(80,45,28,0.45) !important;
          overflow: hidden !important;
        }
        .leaflet-control-zoom a {
          border-radius: 0 !important;
          background: #fffdf9 !important;
          color: var(--brown-color) !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }
        .leaflet-control-zoom a:hover {
          background: var(--brown-color) !important;
          color: white !important;
        }
        /* Minimalistyczna, jednokolorowa mapa z polskimi nazwami */
        .leaflet-tile {
          filter: grayscale(1) saturate(0) contrast(0.85) brightness(1.05);
        }
        /* Vignette: podświetlona Polska, sąsiednie kraje przyciemnone (efekt blur/dim) */
        #poland-map .leaflet-container::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 45%,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) 45%,
            rgba(80, 45, 28, 0.55) 100%
          );
          pointer-events: none;
          mix-blend-mode: multiply;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
      `;
      document.head.appendChild(style);

      setMap(mapInstance);
    }

    return () => {
      if (window.selectCity) {
        delete window.selectCity;
      }
    };
  }, [leafletLoaded, map, selectedCity, mapLocations, polishCities, currentLocale]);

  const getSelectedMapLocations = () => {
    if (!selectedCity) return [];
    return mapLocations.filter(loc => loc.city === selectedCity);
  };

  const selectedMapLocations = getSelectedMapLocations();

  return (
    <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-white mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center mb-16">
          <div className="order-2 lg:order-1 text-center lg:text-left flex flex-col items-center lg:items-start">
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
                <p className="text-gray-600">
                  {currentLocale === "pl" ? "Ładowanie mapy..." : "Loading map..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal for City Details */}
        {selectedCity && selectedMapLocations.length > 0 && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedCity(null);
              }
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
            <AnimatedSection 
              className="bg-white rounded-3xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative border-l-4 border-[var(--brown-color)] shadow-2xl"
              direction="up"
              duration={0.3}
            >
              <button
                onClick={() => setSelectedCity(null)}
                className="absolute top-4 right-4 btn-unified p-2 rounded-full z-10"
              >
                <X className="w-6 h-6 text-gray-500 hover:text-[var(--brown-color)]" />
              </button>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                {getCityName(selectedCity, currentLocale)}
              </h2>

              {selectedMapLocations.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-[var(--accent-color)] mb-6">
                    {currentLocale === "pl" ? "Miejsca w których odbyły się moje warsztaty" : "Places where my masterclasses took place"}
                  </h3>
                  <div className="space-y-5">
                    {selectedMapLocations.map((location, locationIndex) => {
                      const photos = location.photos || [];
                      const hasPhotos = photos.length > 0;

                      return (
                        <article
                          key={`${location.id}-${locationIndex}`}
                          className="bg-white rounded-2xl border border-gray-200/80 hover:border-[var(--brown-color)]/30 hover:shadow-md transition-all duration-300 overflow-hidden"
                        >
                          {/* Info section */}
                          <div className="p-5 sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                              <div className="flex items-center gap-2.5">
                                <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[var(--brown-color)]/8 text-[var(--brown-color)]">
                                  {location.type === "school"
                                    ? currentLocale === "pl" ? "Szkoła" : "School"
                                    : location.type === "bakery"
                                    ? currentLocale === "pl" ? "Piekarnia" : "Bakery"
                                    : location.type === "cukiernia"
                                    ? currentLocale === "pl" ? "Cukiernia" : "Confectionery"
                                    : location.type === "kawiarnia"
                                    ? currentLocale === "pl" ? "Kawiarnia" : "Cafe"
                                    : location.type === "private_client"
                                    ? currentLocale === "pl" ? "Klient prywatny" : "Private client"
                                    : currentLocale === "pl" ? "Inne" : "Other"}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                                  <MapPin className="w-3 h-3 text-[var(--brown-color)]/60" />
                                  <span className="font-medium">
                                    {getCityName(location.city, currentLocale)}
                                  </span>
                                </span>
                              </div>
                            </div>

                            <h4 className="text-lg sm:text-xl font-bold text-[var(--accent-color)] mb-3">
                              {location.name[currentLocale as keyof typeof location.name]}
                            </h4>

                            {location.description[currentLocale as keyof typeof location.description] && (
                              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                {location.description[currentLocale as keyof typeof location.description]}
                              </p>
                            )}
                          </div>

                          {/* Gallery section */}
                          {hasPhotos && photos.length > 0 && (
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                              <h3 className="text-lg sm:text-xl font-semibold text-[var(--accent-color)] mb-4">
                                {currentLocale === "pl" ? "Galeria zdjęć" : "Photo Gallery"}
                              </h3>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {photos.map((photo, index) => (
                                      <button
                                        key={`${location.id}-photo-${index}`}
                                        type="button"
                                        onClick={() =>
                                          setPhotoGallery({
                                            photos,
                                        index: index,
                                            title: location.name[currentLocale as keyof typeof location.name],
                                          })
                                        }
                                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[var(--brown-color)] transition-colors group"
                                      >
                                        <Image
                                          src={photo}
                                      alt={`${location.name[currentLocale as keyof typeof location.name]} - ${index + 1}`}
                                          fill
                                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                      </button>
                                    ))}
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}
            </AnimatedSection>
            </div>
          </div>
        )}
      </div>
      {/* Photo gallery lightbox */}
      {photoGallery && photoGallery.photos.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPhotoGallery(null);
            }
          }}
        >
          <div 
            className="relative max-w-7xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPhotoGallery(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                <Image
                  src={photoGallery.photos[photoGallery.index]}
                  alt={`${photoGallery.title} - ${photoGallery.index + 1}`}
                  fill
                className="object-contain"
                priority
                />
                {photoGallery.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                    className="absolute left-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      onClick={() =>
                      setPhotoGallery({
                        ...photoGallery,
                        index: (photoGallery.index - 1 + photoGallery.photos.length) % photoGallery.photos.length,
                      })
                      }
                    >
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <button
                      type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      onClick={() =>
                      setPhotoGallery({
                        ...photoGallery,
                        index: (photoGallery.index + 1) % photoGallery.photos.length,
                      })
                      }
                    >
                    <ChevronRight className="w-6 h-6 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              {photoGallery.photos.length > 1 && (
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 max-h-20 overflow-y-auto">
                  {photoGallery.photos.map((photo, index) => (
                    <button
                      key={index}
                      type="button"
                    onClick={() => setPhotoGallery({ ...photoGallery, index })}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                        index === photoGallery.index
                          ? "border-[var(--brown-color)]"
                        : "border-gray-300"
                      } bg-gray-100`}
                    >
                      <Image
                        src={photo}
                        alt={`${photoGallery.title} miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>
      )}
    </AnimatedSection>
  );
}