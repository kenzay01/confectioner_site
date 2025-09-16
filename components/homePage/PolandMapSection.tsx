"use client";
import { useState, useEffect, useRef } from "react";
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

// Координати міст Польщі
const cities = [
  { name: "Tychy", lat: 50.1348, lng: 18.9895, masterclassId: "masterclass001" },
  { name: "Warszawa", lat: 52.2297, lng: 21.0122, masterclassId: "masterclass002" },
  { name: "Kraków", lat: 50.0647, lng: 19.9450, masterclassId: "masterclass003" },
  { name: "Gdańsk", lat: 54.3520, lng: 18.6466, masterclassId: "masterclass004" },
  { name: "Wrocław", lat: 51.1079, lng: 17.0385, masterclassId: "masterclass005" },
];

export default function PolandMapSection() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const currentLocale = useCurrentLanguage();
  const { masterclasses, loading } = useItems();

  // Завантаження Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
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

    loadLeaflet();
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

      // Додаємо маркери міст
      cities.forEach((city) => {
        const masterclass = masterclasses.find(mc => mc.id === city.masterclassId);
        if (!masterclass) return;

        // Створюємо custom HTML маркер в стилі сайту
        const markerHtml = `
          <div class="custom-marker-container" style="position: relative;">
            <div class="pulse-ring" style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: rgba(80, 45, 28, 0.2);
              animation: pulse 2s infinite;
            "></div>
            <div class="marker-content" style="
              position: relative;
              z-index: 10;
              width: 64px;
              height: 64px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s ease;
              filter: drop-shadow(0 6px 20px rgba(0,0,0,0.25));
              border-radius: 16px;
              overflow: hidden;
            " onclick="window.selectCity('${city.name}')">
              <img src="${masterclass.photo}" alt="${city.name}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;" />
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-leaflet-marker',
          iconSize: [64, 64],
          iconAnchor: [32, 32],
        });

        const marker = L.marker([city.lat, city.lng], { icon: customIcon })
          .addTo(mapInstance)
          .on('click', (e?: { originalEvent: Event }) => {
            if (e && e.originalEvent) {
              e.originalEvent.stopPropagation();
            }
            console.log('Leaflet click on city:', city.name);
            setSelectedCity(prevSelected => prevSelected === city.name ? null : city.name);
          })
          .on('mousedown', (e?: { originalEvent: Event }) => {
            if (e && e.originalEvent) {
              e.originalEvent.stopPropagation();
            }
          });

        // Додаємо tooltip в стилі сайту
        marker.bindTooltip(city.name, {
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
        .custom-tooltip:before {
          border-top-color: var(--brown-color) !important;
        }
        .marker-content:hover {
          transform: scale(1.15);
          filter: drop-shadow(0 8px 25px rgba(80, 45, 28, 0.4));
        }
        .marker-content:active {
          transform: scale(1.05);
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
  }, [leafletLoaded, map, selectedCity, masterclasses]);

  const getSelectedMasterclass = () => {
    if (!selectedCity) return null;
    const city = cities.find(c => c.name === selectedCity);
    if (!city) return null;
    return masterclasses.find(mc => mc.id === city.masterclassId);
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
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
            {currentLocale === "pl" 
              ? "Miasta z naszymi mistrzowskimi kursami" 
              : "Cities with our masterclasses"
            }
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {currentLocale === "pl" 
              ? "Kliknij na znacznik, aby zobaczyć szczegóły masterklasy" 
              : "Click on a marker to see masterclass details"
            }
          </p>
        </div>

        {/* Real Map Container */}
        <div className="relative mb-12">
          <div 
            ref={mapRef}
            className="w-full h-96 sm:h-[500px] rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            style={{ minHeight: '400px' }}
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
                  <div className="relative group">
                    <Image
                      src={selectedMasterclass.photo}
                      alt={selectedMasterclass.title[currentLocale as keyof typeof selectedMasterclass.title]}
                      width={400}
                      height={320}
                      className="w-full h-80 object-cover rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
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