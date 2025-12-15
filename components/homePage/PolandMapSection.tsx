"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useItems } from "@/context/itemsContext";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import AnimatedSection from "@/components/AnimatedSection";
import { X, MapPin, Calendar } from "lucide-react";
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
        center: [52.0, 19.0],
        zoom: 6.5,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: false,
        // Bardziej ciasne granice, żeby mapa skupiała się tylko na Polsce
        maxBounds: [
          [48.9, 13.9], // południowo-zachodni narożnik
          [55.0, 24.3], // północno-wschodni narożnik
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 6.2,
        maxZoom: 9
      });

      mapInstance.setMaxBounds([
        [48.9, 13.9],
        [55.0, 24.3]
      ]);

      // НОВА МАПА: Stadia Maps - Alidade Smooth (мінімалістична, сучасна, з польською мовою)
      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://openmaptiles.org/">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20
      }).addTo(mapInstance);

      // АЛЬТЕРНАТИВА 1: Stadia Maps - OSM Bright (яскравіша, детальніша)
      // L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
      //   attribution: '© <a href="https://stadiamaps.com/">Stadia Maps</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      //   maxZoom: 20
      // }).addTo(mapInstance);

      // АЛЬТЕРНАТИВА 2: OpenStreetMap Standard (класична, надійна)
      // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      //   maxZoom: 19
      // }).addTo(mapInstance);

      const citiesWithMasterclasses = new Set(masterclasses.filter(mc => mc.city).map(mc => mc.city));
      const citiesWithLocations = new Set(mapLocations.filter(loc => loc.city).map(loc => loc.city));
      const allCities = new Set([...citiesWithMasterclasses, ...citiesWithLocations]);
        
      allCities.forEach((cityName) => {
        const cityData = polishCities.find(city => city.name === cityName);
        if (!cityData) return;

        const hasMasterclasses = citiesWithMasterclasses.has(cityName);
        const hasLocations = citiesWithLocations.has(cityName);
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
        if (hasMasterclasses && hasLocations) {
          tooltipText = `${translatedCityName} (${locationCount} ${currentLocale === 'pl' ? 'miejsc' : 'places'})`;
        } else if (hasLocations) {
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
  }, [leafletLoaded, map, selectedCity, masterclasses, mapLocations, polishCities, currentLocale]);

  const getSelectedMasterclasses = () => {
    if (!selectedCity) return [];
    return masterclasses.filter(mc => mc.city === selectedCity);
  };

  const getSelectedMapLocations = () => {
    if (!selectedCity) return [];
    return mapLocations.filter(loc => loc.city === selectedCity);
  };

  const selectedMasterclasses = getSelectedMasterclasses();
  const selectedMapLocations = getSelectedMapLocations();

  if (loading) {
    return (
      <AnimatedSection className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {currentLocale === "pl" ? "Ładowanie..." : "Loading..."}
            </p>
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
        {selectedCity && (selectedMasterclasses.length > 0 || selectedMapLocations.length > 0) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
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

              {selectedMasterclasses.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {currentLocale === "pl" ? "Warsztaty" : "Masterclasses"}
                  </h3>
                  <div className="space-y-4">
                    {selectedMasterclasses.map((masterclass) => (
                      <div key={masterclass.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="lg:w-1/3">
                            <Image
                              src={getRandomImage(masterclass.id, masterclass.city)}
                              alt={masterclass.title[currentLocale as keyof typeof masterclass.title]}
                              width={200}
                              height={200}
                              className="object-contain w-full max-h-48 rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/materials/Donut png без фона.png";
                              }}
                            />
                          </div>
                          <div className="lg:w-2/3">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[var(--brown-color)]/10 text-[var(--brown-color)] mb-2">
                              {currentLocale === "pl" ? "Masterclass" : "Masterclass"}
                            </span>
                            <h4 className="text-xl font-bold text-gray-800 mb-3">
                              {masterclass.title[currentLocale as keyof typeof masterclass.title]}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">{masterclass.location[currentLocale as keyof typeof masterclass.location]}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">
                                  {new Date(masterclass.date).toLocaleDateString(currentLocale)}
                                  {masterclass.dateEnd && ` - ${new Date(masterclass.dateEnd).toLocaleDateString(currentLocale)}`}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {masterclass.description[currentLocale as keyof typeof masterclass.description].split('\\n')[0]}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMapLocations.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-5">
                    {currentLocale === "pl" ? "Miejsca, w których byłem" : "Places I've been"}
                  </h3>
                  <div className="space-y-6">
                    {selectedMapLocations.map((location) => {
                      const photos = location.photos || [];
                      const hasPhotos = photos.length > 0;
                      const mainPhoto = hasPhotos ? photos[0] : "/materials/Donut png без фона.png";
                      const extraPhotos = hasPhotos ? photos.slice(1, 6) : [];

                      return (
                        <article
                          key={location.id}
                          className="bg-gradient-to-br from-white via-[#fff9f5] to-white rounded-3xl border border-[var(--brown-color)]/15 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden"
                        >
                          {/* Info first */}
                          <div className="p-6 sm:p-7 border-b border-[var(--brown-color)]/10">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                              <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] bg-[var(--accent-color)]/12 text-[var(--accent-color)]">
                                {location.type === "school"
                                  ? currentLocale === "pl" ? "Szkoła" : "School"
                                  : location.type === "bakery"
                                  ? currentLocale === "pl" ? "Piekarnia" : "Bakery"
                                  : location.type === "private_client"
                                  ? currentLocale === "pl" ? "Klient prywatny" : "Private client"
                                  : currentLocale === "pl" ? "Inne" : "Other"}
                              </span>
                              <span className="text-[12px] text-gray-600 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[var(--brown-color)]/80" />
                                <span className="font-medium">
                                  {getCityName(location.city, currentLocale)}
                                </span>
                              </span>
                            </div>

                            <h4 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                              {location.name[currentLocale as keyof typeof location.name]}
                            </h4>

                            {location.description[currentLocale as keyof typeof location.description] && (
                              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                                {location.description[currentLocale as keyof typeof location.description]}
                              </p>
                            )}
                          </div>

                          {/* Then gallery */}
                          {hasPhotos && (
                            <div className="p-4 sm:p-5 bg-gradient-to-r from-white to-[#fff3e6]">
                              <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-[1.8fr,1.4fr] items-stretch">
                                {/* Main photo */}
                                <button
                                  type="button"
                                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 group cursor-pointer"
                                  onClick={() =>
                                    setPhotoGallery({
                                      photos,
                                      index: 0,
                                      title: location.name[currentLocale as keyof typeof location.name],
                                    })
                                  }
                                >
                                  <Image
                                    src={mainPhoto}
                                    alt={`${location.name[currentLocale as keyof typeof location.name]} - główne zdjęcie`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = "/materials/Donut png без фона.png";
                                    }}
                                  />
                                  {photos.length > 1 && (
                                    <div className="absolute right-3 bottom-3 px-3 py-1.5 rounded-full bg-black/60 text-[11px] font-medium text-white backdrop-blur-sm">
                                      {currentLocale === "pl"
                                        ? `+${photos.length - 1} zdjęć`
                                        : `+${photos.length - 1} photos`}
                                    </div>
                                  )}
                                </button>

                                {/* Extra photos */}
                                {extraPhotos.length > 0 && (
                                  <div className="grid grid-cols-4 sm:grid-cols-2 gap-2 sm:gap-3">
                                    {extraPhotos.map((photo, index) => (
                                      <div
                                        key={index}
                                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer group"
                                        onClick={() =>
                                          setPhotoGallery({
                                            photos,
                                            index: index + 1,
                                            title: location.name[currentLocale as keyof typeof location.name],
                                          })
                                        }
                                      >
                                        <Image
                                          src={photo}
                                          alt={`${location.name[currentLocale as keyof typeof location.name]} - ${index + 2}`}
                                          fill
                                          className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                                          onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = "none";
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                )}
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
        )}
      </div>
      {/* Photo gallery lightbox */}
      {photoGallery && photoGallery.photos.length > 0 && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] px-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] p-4 sm:p-6 flex flex-col gap-4 relative">
            <button
              type="button"
              onClick={() => setPhotoGallery(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <div className="flex flex-col gap-3 mt-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {photoGallery.title}
              </h3>
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={photoGallery.photos[photoGallery.index]}
                  alt={`${photoGallery.title} - ${photoGallery.index + 1}`}
                  fill
                  className="object-contain bg-gray-900/5"
                />
                {/* Prev / Next */}
                {photoGallery.photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-2 top-1/2 -translate-y-1/2 px-2.5 py-2 rounded-full bg-black/55 text-white hover:bg-black/80 transition-colors text-xs sm:text-sm"
                      onClick={() =>
                        setPhotoGallery((prev) =>
                          !prev
                            ? prev
                            : {
                                ...prev,
                                index:
                                  (prev.index - 1 + prev.photos.length) %
                                  prev.photos.length,
                              }
                        )
                      }
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-2 rounded-full bg-black/55 text-white hover:bg-black/80 transition-colors text-xs sm:text-sm"
                      onClick={() =>
                        setPhotoGallery((prev) =>
                          !prev
                            ? prev
                            : {
                                ...prev,
                                index: (prev.index + 1) % prev.photos.length,
                              }
                        )
                      }
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              {photoGallery.photos.length > 1 && (
                <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 mt-1">
                  {photoGallery.photos.map((photo, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setPhotoGallery((prev) =>
                          !prev
                            ? prev
                            : {
                                ...prev,
                                index,
                              }
                        )
                      }
                      className={`relative aspect-square rounded-lg overflow-hidden border ${
                        index === photoGallery.index
                          ? "border-[var(--brown-color)]"
                          : "border-gray-200"
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
        </div>
      )}
    </AnimatedSection>
  );
}