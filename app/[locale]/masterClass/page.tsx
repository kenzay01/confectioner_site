"use client";
import { useState, useMemo, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Masterclass } from "@/types/masterclass";
import { useItems } from "@/context/itemsContext";
import { format, isSameDay, addDays, isBefore } from "date-fns";
import { pl, enGB } from "date-fns/locale";
import AnimatedSection from "@/components/AnimatedSection";
import bread2 from "@/public/materials/bread2.png";

const formatDate = (
  masterclass: Masterclass,
  currentLocale: "pl" | "en"
): string => {
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

// Функція для перевірки, чи закінчився майстер-клас (залишаємо без змін)
const isMasterclassEnded = (masterclass: Masterclass): boolean => {
  const endDate = new Date(masterclass.dateEnd || masterclass.date);
  endDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return endDate < today;
};

// Компонент слайдера
const SliderSection = ({ masterclasses }: { masterclasses: Masterclass[] }) => {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const [currentSlide, setCurrentSlide] = useState(1); // Починаємо з першого реального слайду (індекс 1 через клон)
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Створюємо масив із клонованими слайдами: [останній, ...оригінальні, перший]
  const extendedMasterclasses = useMemo(() => {
    if (masterclasses.length === 0) return [];
    return [
      masterclasses[masterclasses.length - 1], // Клон останнього
      ...masterclasses, // Оригінальні слайди
      masterclasses[0], // Клон першого
    ];
  }, [masterclasses]);

  // Обробка переходу для циклічності
  useEffect(() => {
    if (masterclasses.length <= 1) return; // Немає сенсу для циклічності, якщо 1 або 0 слайдів

    if (currentSlide === 0) {
      // Якщо на клонованому останньому слайді, переміщаємо до передостаннього реального
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(masterclasses.length);
      }, 500); // Чекаємо завершення анімації
    } else if (currentSlide === extendedMasterclasses.length - 1) {
      // Якщо на клонованому першому слайді, переміщаємо до першого реального
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
      }, 500); // Чекаємо завершення анімації
    } else {
      setIsTransitioning(true);
    }
  }, [currentSlide, masterclasses.length, extendedMasterclasses.length]);

  // Навігація
  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  const [mobileSlide, setMobileSlide] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setMobileSlide("50px");
      } else {
        setMobileSlide("160px");
      }
    };

    handleResize(); // Встановлюємо початкове значення

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mt-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        {currentLocale === "pl" ? "Galeria wydarzeń" : "Event Gallery"}
      </h2>
      {masterclasses.length === 0 && (
        <p className="text-center text-[var(--accent-color)]">
          {currentLocale === "pl"
            ? "Brak dostępnych wydarzeń"
            : "No events available"}
        </p>
      )}
      <AnimatedSection className="relative w-full overflow-hidden">
        <div
          className="flex"
          style={{
            transform: `translateX(calc(-${
              currentSlide * 80
            }% + ${mobileSlide}))`,
            gap: "16px", // Відстань між слайдами
            transition: isTransitioning ? "transform 0.5s ease-in-out" : "none", // Вимикаємо анімацію для безшовного переходу
          }}
        >
          {extendedMasterclasses.map((masterclass, index) => {
            const isEnded = isMasterclassEnded(masterclass);
            return (
              <div
                key={`${masterclass.id}-${index}`} // Унікальний ключ для клонованих слайдів
                className="flex-shrink-0 px-2"
                style={{
                  width: `calc(80% - 16px)`, // 80% ширини для основного слайду
                }}
              >
                <div className="relative min-h-screen sm:min-h-[80vh] rounded-lg overflow-hidden">
                  <Image
                    src={
                      masterclass.photo ||
                      "/placeholder.jpg"
                    }
                    alt={masterclass.title[currentLocale]}
                    fill
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                    priority
                    quality={75}
                    sizes="100vw (max-width: 600px) 100vw, (max-width: 1024px) 80vw, 70vw"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.jpg";
                    }}
                  />
                  <div className="absolute inset-0 w-full h-full bg-black/40 z-10"></div>
                  <div className="h-full  bg-black/40 flex items-center justify-center min-h-screen sm:min-h-screen z-15">
                    <div className="bg-white p-6 rounded-lg text-center max-w-sm z-15">
                      <h3 className="text-3xl font-bold mb-4 ">
                        {masterclass.title[currentLocale]}
                      </h3>
                      <div className="flex flex-col gap-2 justify-center items-start text-[var(--accent-color)]">
                        <div className="flex items-center justify-center gap-2">
                          <Calendar className="w-6 h-6" />
                          <span>{formatDate(masterclass, currentLocale)}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <MapPin className="w-6 h-6" />
                          <span>{masterclass.location[currentLocale]}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Users className="w-6 h-6" />
                          <span>
                            {(masterclass.availableSlots || 0) -
                              (masterclass.pickedSlots || 0)}{" "}
                            {currentLocale === "pl"
                              ? "wolnych miejsc"
                              : "slots available"}
                          </span>
                        </div>
                        <div className="text-3xl font-bold mt-4">
                          {masterclass.price} zł
                        </div>
                      </div>
                      {isEnded ? (
                        <p className="text-[var(--accent-color)] font-semibold mt-4">
                          {currentLocale === "pl"
                            ? "To wydarzenie się zakończyło"
                            : "This event has ended"}
                        </p>
                      ) : (
                        <Link
                          href={`/${currentLocale}/masterClass/masterclass-${masterclass.id}`}
                          className={`btn-unified px-6 py-3 mt-4 ${
                            (masterclass.availableSlots || 0) -
                              (masterclass.pickedSlots || 0) >
                            0
                              ? ""
                              : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {(masterclass.availableSlots || 0) -
                            (masterclass.pickedSlots || 0) >
                          0
                            ? currentLocale === "pl"
                              ? "Weź udział"
                              : "Book Now"
                            : currentLocale === "pl"
                            ? "Dołącz do listy oczekujących"
                            : "Join Waitlist"}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 btn-unified p-2 rounded-full"
        >
          &larr;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 btn-unified p-2 rounded-full"
        >
          &rarr;
        </button>
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {masterclasses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index + 1)} // Зміщуємо індекс через клон
              className={`w-3 h-3 rounded-full ${
                index + 1 === currentSlide
                  ? "bg-[var(--brown-color)]"
                  : "bg-gray-400"
              }`}
            />
          ))}
        </div> */}
      </AnimatedSection>
    </div>
  );
};

export default function MasterClass() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { masterclasses, loading, error } = useItems();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

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

  // Filter masterclasses for the selected date or show only the nearest upcoming event
  const filteredMasterclasses = useMemo(() => {
    if (masterclasses.length === 0) return [];

    if (!selectedDate) {
      // Show only the nearest upcoming masterclass
      const upcomingMasterclasses = masterclasses.filter((mc) => {
        const endDate = new Date(mc.dateEnd || mc.date);
        endDate.setHours(23, 59, 59, 999); // End of day
        return !isBefore(endDate, today);
      });
      const sortedUpcoming = upcomingMasterclasses.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      // Return only the first (nearest) masterclass
      return sortedUpcoming.length > 0 ? [sortedUpcoming[0]] : [];
    }

    // Find masterclasses matching the selected date
    const matchedMasterclasses = masterclasses.filter((mc) => {
      const startDate = new Date(mc.date);
      const endDate = new Date(mc.dateEnd || mc.date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
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

    return matchedMasterclasses;
  }, [masterclasses, selectedDate, today]);

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
    const locale = currentLocale === "pl" ? pl : enGB;

    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekdays = Array.from(
      { length: 7 },
      (_, i) =>
        locale.localize?.day(i as 0 | 1 | 2 | 3 | 4 | 5 | 6, {
          width: "short",
        }) || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i]
    );

    const prevMonth = () => {
      if (calendarMonth === 0) {
        setCalendarYear(calendarYear - 1);
        setCalendarMonth(11);
      } else {
        setCalendarMonth(calendarMonth - 1);
      }
    };

    const nextMonth = () => {
      if (calendarMonth === 11) {
        setCalendarYear(calendarYear + 1);
        setCalendarMonth(0);
      } else {
        setCalendarMonth(calendarMonth + 1);
      }
    };

    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className="btn-unified p-2 rounded-full"
            type="button"
          >
            ←
          </button>
          <h3 className="text-lg font-semibold">
            {format(new Date(calendarYear, calendarMonth), "MMMM yyyy", {
              locale,
            })}
          </h3>
          <button
            onClick={nextMonth}
            className="btn-unified p-2 rounded-full"
            type="button"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {weekdays.map((day: string, i: number) => (
            <div key={i} className="font-medium">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const date = new Date(calendarYear, calendarMonth, day);
            const isEventDay = eventDates.some((eventDate) =>
              isSameDay(eventDate, date)
            );
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const isPastDay = isBefore(date, today);
            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`p-2 rounded-full relative ${
                  isEventDay
                    ? isPastDay
                      ? "bg-gray-300 text-gray-600"
                      : "bg-[var(--accent-color)] text-white"
                    : isToday
                    ? "bg-[var(--brown-color)]/30 text-[var(--brown-color)] font-bold"
                    : ""
                } ${
                  isSelected ? "ring-2 ring-[var(--brown-color)] ring-offset-1" : ""
                } hover:bg-[var(--brown-color)]/20 transition-all duration-200`}
                disabled={isPastDay && !isEventDay}
              >
                {day}
                {isToday && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--brown-color)] rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className=" py-8 relative">
        <div className="absolute -top-20 sm:-top-25 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center pointer-events-none">
          <Image src={bread2} alt="bread" width={600} height={600} className="w-auto h-92"/>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Masterclass List */}
            <div className="lg:col-span-2 space-y-6 md:order-1 order-2">
            {loading ? (
              <p className="lg:col-span-2 self-center text-center text-[var(--accent-color)]">
                Loading...
              </p>
            ) : error ? (
              <p className="lg:col-span-2 self-center text-center text-red-500">
                {error}
              </p>
            ) : filteredMasterclasses.length === 0 ? (
              <p className="lg:col-span-2 self-center text-center text-[var(--accent-color)]">
                {selectedDate
                  ? currentLocale === "pl"
                    ? "Brak warsztatów dla wybranej daty"
                    : "No masterclasses for the selected date"
                  : currentLocale === "pl"
                  ? "Brak nadchodzących warsztatów"
                  : "No upcoming masterclasses available"}
              </p>
            ) : (
              <div className="lg:col-span-2 space-y-6">
                {filteredMasterclasses.map((masterclass) => (
                  <AnimatedSection
                    key={masterclass.id}
                    direction="left"
                  >
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={masterclass.photo || "/placeholder.jpg"}
                        alt={masterclass.title[currentLocale]}
                        width={200}
                        height={200}
                        className={`rounded-lg object-cover w-48 h-48 sm:w-64 sm:h-64 ${
                          isMasterclassEnded(masterclass)
                            ? "grayscale"
                            : ""
                        }`}
                        placeholder="blur"
                        blurDataURL="/placeholder.jpg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-semibold  mb-2">
                        {masterclass.title[currentLocale]}
                      </h2>
                      <div className="flex items-center gap-2 text-[var(--accent-color)] mb-2">
                        <Calendar className="w-5 h-5" />
                        <span>{formatDate(masterclass)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--accent-color)] mb-2">
                        <MapPin className="w-5 h-5" />
                        <span>
                          {masterclass.location[currentLocale]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--accent-color)] mb-4">
                        <Users className="w-5 h-5" />
                        <span>
                          {(masterclass.availableSlots || 0) -
                            (masterclass.pickedSlots || 0)}{" "}
                          {currentLocale === "pl"
                            ? "wolnych miejsc"
                            : "slots available"}
                        </span>
                      </div>
                      <div className="text-2xl font-bold  mb-4">
                        {masterclass.price} zł
                      </div>
                      {isMasterclassEnded(masterclass) ? (
                        <p className="text-[var(--accent-color)] font-semibold">
                          {currentLocale === "pl"
                            ? "To wydarzenie się zakończyło"
                            : "This event has ended"}
                        </p>
                      ) : (
                        <Link
                          href={`/${currentLocale}/masterClass/masterclass-${masterclass.id}`}
                          className={`btn-unified px-6 py-3 ${
                            (masterclass.availableSlots || 0) -
                              (masterclass.pickedSlots || 0) >
                            0
                              ? ""
                              : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          {(masterclass.availableSlots || 0) -
                            (masterclass.pickedSlots || 0) >
                          0
                            ? currentLocale === "pl"
                              ? "Weź udział"
                              : "Book Now"
                            : currentLocale === "pl"
                            ? "Dołącz do listy oczekujących"
                            : "Join Waitlist"}
                        </Link>
                      )}
                    </div>
                  </div>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>

            {/* Right Side: Calendar */}
            <div className="lg:col-span-1 md:order-2 order-1">
              <CustomCalendar />
            </div>
          </div>
        </div>
        
        {/* Event Gallery Slider Section */}
        <SliderSection masterclasses={filteredMasterclasses} />
        
        {/* <div className="mt-12 ">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            {currentLocale === "pl" ? "Galeria wydarzeń" : "Event Gallery"}
          </h2>
          {masterclasses.length === 0 && (
            <p className="text-center text-[var(--accent-color)]">
              {currentLocale === "pl"
                ? "Brak dostępnych wydarzeń"
                : "No events available"}
            </p>
          )}
          <div className="relative  w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out "
              style={{
                transform: `translateX(-${
                  currentSlide * (100 / masterclasses.length)
                }%)`,
                width: `${masterclasses.length * 100}%`,
              }}
            >
              {masterclasses.map((masterclass) => {
                const isEnded = isMasterclassEnded(masterclass);
                return (
                  <div
                    key={masterclass.id}
                    className="w-full flex-shrink-0 px-2 "
                    style={{
                      width: `${100 / masterclasses.length}%`,
                    }}
                  >
                    <div
                      className="min-h-screen rounded-lg overflow-hidden"
                      style={{
                        backgroundImage: `url(${
                          masterclass.backgroundImage ||
                          masterclass.photo ||
                          "/placeholder.jpg"
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="h-full bg-black/40 flex items-center justify-center min-h-screen">
                        <div className="bg-white/80 p-6 rounded-lg text-center max-w-2xl">
                          <h3 className="text-3xl font-bold mb-4 ">
                            {masterclass.title[currentLocale]}
                          </h3>
                          <div className="flex flex-col gap-2 text-[var(--accent-color)]">
                            <div className="flex items-center justify-center gap-2">
                              <Calendar className="w-6 h-6" />
                              <span>{formatDate(masterclass)}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <MapPin className="w-6 h-6" />
                              <span>{masterclass.location[currentLocale]}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <Users className="w-6 h-6" />
                              <span>
                                {masterclass.availableSlots -
                                  masterclass.pickedSlots}{" "}
                                {currentLocale === "pl"
                                  ? "wolnych miejsc"
                                  : "slots available"}
                              </span>
                            </div>
                            <div className="text-3xl font-bold mt-4">
                              {masterclass.price} zł
                            </div>
                          </div>
                          {isEnded ? (
                            <p className="text-[var(--accent-color)] font-semibold mt-4">
                              {currentLocale === "pl"
                                ? "To wydarzenie się zakończyło"
                                : "This event has ended"}
                            </p>
                          ) : (
                            <Link
                              href={`/${currentLocale}/masterClass/masterclass-${masterclass.id}`}
                              className={`inline-block px-6 py-3 rounded-full font-bold text-white mt-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                                masterclass.availableSlots -
                                  masterclass.pickedSlots >
                                0
                                  ? "bg-[var(--brown-color)] hover:bg-[var(--accent-color)]"
                                  : "bg-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {masterclass.availableSlots -
                                masterclass.pickedSlots >
                              0
                                ? currentLocale === "pl"
                                  ? "Weź udział"
                                  : "Book Now"
                                : currentLocale === "pl"
                                ? "Dołącz do listy oczekujących"
                                : "Join Waitlist"}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 btn-unified p-2 rounded-full"
            >
              &larr;
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 btn-unified p-2 rounded-full"
            >
              &rarr;
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {masterclasses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide
                      ? "bg-[var(--brown-color)]"
                      : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
