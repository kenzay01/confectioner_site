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


// Компонент слайдера
const SliderSection = ({ masterclasses }: { masterclasses: Masterclass[] }) => {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const [currentSlide, setCurrentSlide] = useState(1); // Починаємо з першого реального слайду (індекс 1 через клон)
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Фільтруємо тільки активні майстер-класи (не завершені)
  const activeMasterclasses = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return masterclasses.filter((mc) => {
      const endDate = new Date(mc.dateEnd || mc.date);
      endDate.setHours(23, 59, 59, 999);
      return endDate >= today;
    });
  }, [masterclasses]);

  // Створюємо масив із клонованими слайдами: [останній, ...оригінальні, перший]
  const extendedMasterclasses = useMemo(() => {
    if (activeMasterclasses.length === 0) return [];
    if (activeMasterclasses.length === 1) return activeMasterclasses; // Якщо тільки один слайд, не клонуємо
    return [
      activeMasterclasses[activeMasterclasses.length - 1], // Клон останнього
      ...activeMasterclasses, // Оригінальні слайди
      activeMasterclasses[0], // Клон першого
    ];
  }, [activeMasterclasses]);

  // Обробка переходу для циклічності
  useEffect(() => {
    if (activeMasterclasses.length <= 1) return; // Немає сенсу для циклічності, якщо 1 або 0 слайдів

    if (currentSlide === 0) {
      // Якщо на клонованому останньому слайді, переміщаємо до останнього реального
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(activeMasterclasses.length);
      }, 300); // Зменшуємо час очікування
    } else if (currentSlide === extendedMasterclasses.length - 1) {
      // Якщо на клонованому першому слайді, переміщаємо до першого реального
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
      }, 300); // Зменшуємо час очікування
    }
    
    // Завжди включаємо анімацію після зміни слайду
    const timer = setTimeout(() => {
      setIsTransitioning(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [currentSlide, activeMasterclasses.length, extendedMasterclasses.length]);

  // Навігація
  const nextSlide = () => {
    if (activeMasterclasses.length <= 1) return;
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (activeMasterclasses.length <= 1) return;
    setCurrentSlide((prev) => prev - 1);
  };

  // Автопрокрутка
  useEffect(() => {
    if (activeMasterclasses.length <= 1) return;
    
    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4000); // Змінюємо слайд кожні 4 секунди
    
    return () => clearInterval(autoSlide);
  }, [activeMasterclasses.length]);

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

  if (activeMasterclasses.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[var(--accent-color)]">
          {currentLocale === "pl" ? "Nasze warsztaty" : "Our Masterclasses"}
        </h2>
        <div className="text-center py-20">
          <p className="text-lg text-[var(--accent-color)]">
            {currentLocale === "pl" 
              ? "Brak dostępnych warsztatów" 
              : "No masterclasses available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-[var(--accent-color)]">
        {currentLocale === "pl" ? "Nasze warsztaty" : "Our Masterclasses"}
      </h2>
      <AnimatedSection className="relative w-full overflow-hidden">
        <div
          className="flex"
          style={{
            transform: activeMasterclasses.length > 1 
              ? `translateX(calc(-${currentSlide * 80}% + ${mobileSlide}))`
              : 'translateX(0)',
            gap: "16px", // Відстань між слайдами
            transition: isTransitioning ? "transform 0.3s ease-in-out" : "none", // Швидша анімація для кращого UX
            justifyContent: activeMasterclasses.length === 1 ? "center" : "flex-start",
          }}
        >
          {extendedMasterclasses.map((masterclass, index) => {
            return (
              <div
                key={`${masterclass.id}-${index}`} // Унікальний ключ для клонованих слайдів
                className={`flex-shrink-0 px-2 ${
                  activeMasterclasses.length === 1 
                    ? 'sm:w-[60%] w-[90%]' // Адаптивна ширина для одного слайда
                    : ''
                }`}
                style={{
                  width: activeMasterclasses.length === 1 
                    ? `calc(90% - 16px)` // 90% ширини для одного слайда на мобільних
                    : `calc(80% - 16px)`, // 80% ширини для основного слайду
                }}
              >
                {(() => {
                  const photos = masterclass.photos || (masterclass.photo ? [masterclass.photo] : []);
                  const mainPhoto = photos[0];
                  if (!mainPhoto) {
                    return (
                      <div className="min-h-[55vh] sm:min-h-[65vh] bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200/60">
                        <div className="h-full flex items-center justify-center p-6 sm:p-8">
                          <div className="text-center max-w-lg w-full">
                            <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-[var(--accent-color)]">
                              {masterclass.title[currentLocale]}
                            </h3>
                            
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-5">
                              <div className="flex items-center gap-1.5 text-[var(--accent-color)] bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200/50">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium text-xs sm:text-sm">{formatDate(masterclass, currentLocale)}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[var(--accent-color)] bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200/50">
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium text-xs sm:text-sm">{masterclass.location[currentLocale]}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[var(--accent-color)] bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200/50">
                                <Users className="w-4 h-4" />
                                <span className="font-medium text-xs sm:text-sm">
                                  {(masterclass.availableSlots || 0) -
                                    (masterclass.pickedSlots || 0)}{" "}
                                  {currentLocale === "pl"
                                    ? "wolnych miejsc"
                                    : "slots available"}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-5">
                              {masterclass.price} zł
                            </div>
                            
                            <Link
                              href={`/${currentLocale}/masterClass/masterclass-${masterclass.id}`}
                              className={`btn-unified px-6 py-3 text-base sm:text-lg inline-block ${
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
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="relative min-h-[55vh] sm:min-h-[65vh] rounded-2xl overflow-hidden shadow-lg border border-gray-200/60">
                      {/* Background Photo */}
                      <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-black/50 z-10"></div>
                        <Image
                          src={mainPhoto}
                          alt={masterclass.title[currentLocale]}
                          fill
                          className="object-cover"
                          quality={90}
                        />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-20 h-full flex items-center justify-center p-6 sm:p-8">
                      <div className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl text-center max-w-lg w-full shadow-lg border border-gray-200/50 overflow-hidden">
                        <h3 className="text-2xl sm:text-3xl font-bold mb-5 text-[var(--accent-color)] line-clamp-2 break-words">
                          {masterclass.title[currentLocale]}
                        </h3>
                        
                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-5">
                          <div className="flex items-center gap-1.5 text-[var(--accent-color)] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">{formatDate(masterclass, currentLocale)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--accent-color)] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm md:text-base line-clamp-1 break-words">{masterclass.location[currentLocale]}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--accent-color)] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm md:text-base whitespace-nowrap">
                              {(masterclass.availableSlots || 0) -
                                (masterclass.pickedSlots || 0)}{" "}
                              {currentLocale === "pl"
                                ? "wolnych miejsc"
                                : "slots available"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-5">
                          {masterclass.price} zł
                        </div>
                        
                        <Link
                          href={`/${currentLocale}/masterClass/masterclass-${masterclass.id}`}
                          className={`btn-unified px-6 py-3 text-base sm:text-lg inline-block ${
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
                      </div>
                    </div>
                  </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
        {activeMasterclasses.length > 1 && (
          <>
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
          </>
        )}
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Side: Masterclass List */}
            <div className="lg:col-span-3 space-y-8 md:order-1 order-2">
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
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-lg overflow-hidden">
                    <div className="text-center mb-6">
                      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--accent-color)] mb-4 line-clamp-2 break-words">
                        {masterclass.title[currentLocale]}
                      </h2>
                      
                      <div className="flex flex-wrap justify-center gap-4 mb-6">
                        <div className="flex items-center gap-2 text-[var(--accent-color)] bg-[var(--main-color)]/20 px-4 py-2 rounded-full">
                          <Calendar className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium whitespace-nowrap">{formatDate(masterclass, currentLocale)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--accent-color)] bg-[var(--main-color)]/20 px-4 py-2 rounded-full max-w-full">
                          <MapPin className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium line-clamp-1 break-words">
                            {masterclass.location[currentLocale]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--accent-color)] bg-[var(--main-color)]/20 px-4 py-2 rounded-full">
                          <Users className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium whitespace-nowrap">
                            {(masterclass.availableSlots || 0) -
                              (masterclass.pickedSlots || 0)}{" "}
                            {currentLocale === "pl"
                              ? "wolnych miejsc"
                              : "slots available"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-4xl font-bold text-[var(--accent-color)] mb-6">
                        {masterclass.price} zł
                      </div>
                      
                      {isMasterclassEnded(masterclass) ? (
                        <div className="bg-gray-100 rounded-2xl p-4">
                          <p className="text-gray-600 font-semibold text-lg">
                            {currentLocale === "pl"
                              ? "To wydarzenie się zakończyło"
                              : "This event has ended"}
                          </p>
                        </div>
                      ) : (
                        <Link
                          href={`/${currentLocale}/masterClass/masterclass-${masterclass.id}`}
                          className={`btn-unified px-8 py-4 text-lg inline-block ${
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
            <div className="lg:col-span-2 md:order-2 order-1">
              <CustomCalendar />
            </div>
          </div>
        </div>
        
        {/* Event Gallery Slider Section */}
        <SliderSection masterclasses={masterclasses} />
      </div>
    </div>
  );
}
