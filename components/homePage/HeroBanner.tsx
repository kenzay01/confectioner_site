"use client";
import { useMemo } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Masterclass } from "@/types/masterclass";
import { useItems } from "@/context/itemsContext";
import AnimatedSection from "../AnimatedSection"; // Імпортуйте утилітний компонент

export default function HeroBanner() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { masterclasses, loading, error } = useItems();

  const nearest = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingMasterclasses = masterclasses.filter((mc) => {
      const startDate = new Date(mc.date);
      startDate.setHours(0, 0, 0, 0);
      return startDate >= today;
    });

    if (upcomingMasterclasses.length === 0) {
      return null;
    }

    return upcomingMasterclasses.reduce((prev, curr) => {
      const prevDate = new Date(prev.date);
      const currDate = new Date(curr.date);
      return currDate < prevDate ? curr : prev;
    }, upcomingMasterclasses[0]);
  }, [masterclasses]);

  const formatDate = (masterclass: Masterclass): string => {
    if (masterclass.dateType === "single") {
      const date = new Date(masterclass.date);
      const formattedDate = date.toLocaleDateString(currentLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return `${formattedDate}`;
    } else {
      const startDate = new Date(masterclass.date);
      const endDate = new Date(masterclass.dateEnd || masterclass.date);
      return `${startDate.toLocaleDateString(currentLocale, {
        month: "short",
        day: "numeric",
      })} - ${endDate.toLocaleDateString(currentLocale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`;
    }
  };

  return (
    <AnimatedSection className="relative h-140 flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[500px] bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            {loading
              ? "Loading..."
              : error
              ? "Error loading masterclasses"
              : nearest
              ? nearest.title[currentLocale]
              : "Bake with the Best!"}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-md md:text-lg text-[var(--accent-color)]">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                {loading
                  ? "Loading..."
                  : error
                  ? "Error"
                  : nearest
                  ? formatDate(nearest)
                  : "Date not available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                {loading
                  ? "Loading..."
                  : error
                  ? "Error"
                  : nearest
                  ? nearest.location[currentLocale]
                  : "Location not available"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">
                {loading
                  ? "Loading..."
                  : error
                  ? "Error"
                  : nearest
                  ? currentLocale === "pl"
                    ? `${
                        nearest.availableSlots - nearest.pickedSlots
                      } wolne miejsca`
                    : `${
                        nearest.availableSlots - nearest.pickedSlots
                      } spots available`
                  : "Slots info not available"}
              </span>
            </div>
          </div>
          <div className="mb-8">
            <span className="text-4xl sm:text-5xl font-bold">
              {loading
                ? "Loading..."
                : error
                ? "Error"
                : nearest
                ? `${nearest.price} zł`
                : currentLocale === "pl"
                ? "Cena niedostępna"
                : "Price not available"}
            </span>
          </div>
          <div className="flex justify-center items-center">
            <Link
              href={
                nearest
                  ? `/${currentLocale}/masterClass/masterclass-${nearest.id}`
                  : "#"
              }
              className={`btn-unified text-xl px-12 py-4 ${
                !nearest || loading ? "pointer-events-none opacity-50" : ""
              }`}
            >
              {loading
                ? "Loading..."
                : currentLocale === "pl"
                ? "Weź udział"
                : "Sign Up"}
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
