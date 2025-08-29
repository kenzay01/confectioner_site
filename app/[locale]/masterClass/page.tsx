"use client";
import { useState, useMemo } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Masterclass } from "@/types/masterclass";
import { useItems } from "@/context/itemsContext";
import { format, isSameDay, addDays, isBefore } from "date-fns";
import { pl, enGB } from "date-fns/locale";

export default function MasterClass() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { masterclasses, loading, error } = useItems();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today for comparison

  // Get unique dates for all masterclasses
  const eventDates = useMemo(() => {
    const dates: Date[] = [];
    masterclasses.forEach((mc) => {
      if (mc.dateType === "single") {
        dates.push(new Date(mc.date));
      } else {
        let currentDate = new Date(mc.date);
        const endDate = new Date(mc.dateEnd || mc.date);
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate = addDays(currentDate, 1);
        }
      }
    });
    return dates;
  }, [masterclasses]);

  // Filter masterclasses for the selected date or next upcoming event
  const filteredMasterclass = useMemo(() => {
    if (masterclasses.length === 0) return null;

    if (!selectedDate) {
      // Filter out past masterclasses and select the earliest upcoming one
      const upcomingMasterclasses = masterclasses.filter((mc) => {
        const endDate = new Date(mc.dateEnd || mc.date);
        endDate.setHours(0, 0, 0, 0);
        return !isBefore(endDate, today);
      });
      return (
        upcomingMasterclasses.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )[0] || null
      );
    }

    // Find masterclasses matching the selected date
    const matchedMasterclass = masterclasses.find((mc) => {
      const startDate = new Date(mc.date);
      const endDate = new Date(mc.dateEnd || mc.date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      const normalizedSelectedDate = new Date(selectedDate);
      normalizedSelectedDate.setHours(0, 0, 0, 0);

      return (
        (mc.dateType === "single" &&
          isSameDay(startDate, normalizedSelectedDate)) ||
        (mc.dateType === "range" &&
          normalizedSelectedDate >= startDate &&
          normalizedSelectedDate <= endDate)
      );
    });

    return matchedMasterclass || null;
  }, [masterclasses, selectedDate]);

  // Check if a masterclass has ended
  const isMasterclassEnded = (masterclass: Masterclass): boolean => {
    const endDate = new Date(masterclass.dateEnd || masterclass.date);
    endDate.setHours(0, 0, 0, 0);
    return isBefore(endDate, today);
  };

  // Format date for display
  const formatDate = (masterclass: Masterclass): string => {
    const locale = currentLocale === "pl" ? pl : enGB;
    if (masterclass.dateType === "single") {
      const date = new Date(masterclass.date);
      const formattedDate = format(date, "PPP", { locale });
      return `${formattedDate}`;
    } else {
      const startDate = new Date(masterclass.date);
      const endDate = new Date(masterclass.dateEnd || masterclass.date);
      return `${format(startDate, "MMM d", { locale })} - ${format(
        endDate,
        "MMM d, yyyy",
        { locale }
      )}`;
    }
  };

  // Custom Calendar Component
  const CustomCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const locale = currentLocale === "pl" ? pl : enGB;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekdays = Array.from(
      { length: 7 },
      (_, i) =>
        locale.localize?.day(i as 0 | 1 | 2 | 3 | 4 | 5 | 6, {
          width: "short",
        }) || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]
    );

    const prevMonth = () => {
      setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
      if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
    };

    const nextMonth = () => {
      setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
      if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
    };

    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className="text-[var(--brown-color)] hover:text-[var(--accent-color)]"
          >
            &larr;
          </button>
          <h3 className="text-lg font-semibold text-[var(--brown-color)]">
            {format(new Date(currentYear, currentMonth), "MMMM yyyy", {
              locale,
            })}
          </h3>
          <button
            onClick={nextMonth}
            className="text-[var(--brown-color)] hover:text-[var(--accent-color)]"
          >
            &rarr;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {weekdays.map((day: string, i: number) => (
            <div key={i} className="font-medium text-[var(--brown-color)]">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const date = new Date(currentYear, currentMonth, day);
            const isEventDay = eventDates.some((eventDate) =>
              isSameDay(eventDate, date)
            );
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isPastDay = isBefore(date, today);
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`p-2 rounded-full ${
                  isEventDay
                    ? isPastDay
                      ? "bg-gray-300 text-gray-600"
                      : "bg-[var(--accent-color)] text-white"
                    : "text-[var(--brown-color)]"
                } ${
                  isSelected ? "ring-2 ring-[var(--brown-color)]" : ""
                } hover:bg-[var(--brown-color)]/20`}
                disabled={isPastDay && !isEventDay}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-8 text-center">
          {currentLocale === "pl" ? "Warsztaty" : "Masterclasses"}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Masterclass List */}
          {loading ? (
            <p className="lg:col-span-2 self-center text-center text-[var(--accent-color)]">
              Loading...
            </p>
          ) : error ? (
            <p className="lg:col-span-2 self-center text-center text-red-500">
              {error}
            </p>
          ) : masterclasses.length === 0 ||
            (!selectedDate && !filteredMasterclass) ? (
            <p className="lg:col-span-2 self-center text-center text-[var(--accent-color)]">
              {currentLocale === "pl"
                ? "Brak nadchodzących warsztatów"
                : "No upcoming masterclasses available"}
            </p>
          ) : !filteredMasterclass && selectedDate ? (
            <p className="lg:col-span-2 self-center text-center text-[var(--accent-color)]">
              {currentLocale === "pl"
                ? "Brak warsztatów dla wybranej daty"
                : "No masterclasses for the selected date"}
            </p>
          ) : (
            filteredMasterclass && (
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10 flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={filteredMasterclass.photo || "/placeholder.jpg"}
                      alt={filteredMasterclass.title[currentLocale]}
                      width={200}
                      height={200}
                      className={`rounded-lg object-cover w-48 h-48 sm:w-64 sm:h-64 ${
                        isMasterclassEnded(filteredMasterclass)
                          ? "grayscale"
                          : ""
                      }`}
                      placeholder="blur"
                      blurDataURL="/placeholder.jpg"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[var(--brown-color)] mb-2">
                      {filteredMasterclass.title[currentLocale]}
                    </h2>
                    <div className="flex items-center gap-2 text-[var(--accent-color)] mb-2">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(filteredMasterclass)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--accent-color)] mb-2">
                      <MapPin className="w-5 h-5" />
                      <span>{filteredMasterclass.location[currentLocale]}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--accent-color)] mb-4">
                      <Users className="w-5 h-5" />
                      <span>
                        {filteredMasterclass.availableSlots -
                          filteredMasterclass.pickedSlots}{" "}
                        {currentLocale === "pl"
                          ? "wolnych miejsc"
                          : "slots available"}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[var(--brown-color)] mb-4">
                      {filteredMasterclass.price} zł
                    </div>
                    {isMasterclassEnded(filteredMasterclass) ? (
                      <p className="text-[var(--accent-color)] font-semibold">
                        {currentLocale === "pl"
                          ? "To wydarzenie się zakończyło"
                          : "This event has ended"}
                      </p>
                    ) : (
                      <Link
                        href={`/${currentLocale}/masterClass/masterclass-${filteredMasterclass.id}`}
                        className={`inline-block px-6 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                          filteredMasterclass.availableSlots -
                            filteredMasterclass.pickedSlots >
                          0
                            ? "bg-[var(--brown-color)] hover:bg-[var(--accent-color)]"
                            : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {filteredMasterclass.availableSlots -
                          filteredMasterclass.pickedSlots >
                        0
                          ? currentLocale === "pl"
                            ? "Zarezerwuj"
                            : "Book Now"
                          : currentLocale === "pl"
                          ? "Dołącz do listy oczekujących"
                          : "Join Waitlist"}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* Right Side: Calendar */}
          <div className="lg:col-span-1">
            <CustomCalendar />
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--brown-color)] mb-6 text-center">
            {currentLocale === "pl" ? "Galeria wydarzeń" : "Event Gallery"}
          </h2>
          {masterclasses.length === 0 && (
            <p className="text-center text-[var(--accent-color)]">
              {currentLocale === "pl"
                ? "Brak dostępnych wydarzeń"
                : "No events available"}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterclasses.map((masterclass) => {
              const isEnded = isMasterclassEnded(masterclass);
              return (
                <div
                  key={masterclass.id}
                  className={`group relative rounded-lg overflow-hidden ${
                    isEnded ? "cursor-not-allowed" : ""
                  }`}
                >
                  <Image
                    src={masterclass.photo || "/placeholder.jpg"}
                    alt={masterclass.title[currentLocale]}
                    width={400}
                    height={300}
                    className={`w-full h-64 object-cover ${
                      isEnded
                        ? "grayscale"
                        : "group-hover:scale-105 transition-transform duration-300"
                    }`}
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                  />
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center ${
                      isEnded
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    }`}
                  >
                    <span className="text-white font-semibold text-center">
                      {isEnded
                        ? currentLocale === "pl"
                          ? "Zakończono"
                          : "Ended"
                        : masterclass.title[currentLocale]}
                    </span>
                  </div>
                  {!isEnded && (
                    <Link
                      href={`/${currentLocale}/masterClass/masterclass-${masterclass.id}`}
                      className="absolute inset-0"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
