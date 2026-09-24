"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Masterclass } from "@/types/masterclass";
import { useItems } from "@/context/itemsContext";
import { format, isSameDay } from "date-fns";
import { pl, enGB } from "date-fns/locale";
import AnimatedSection from "@/components/AnimatedSection";
import bread2 from "@/public/materials/bread2.png";
import { getMasterclassFontStyle } from "@/lib/siteFont";
import {
  getMasterclassCalendarDays,
  getMasterclassStartDate,
  isMasterclassPast,
  masterclassOccursOnDay,
  parseMasterclassDate,
  sortMasterclassesByStart,
  startOfLocalDay,
} from "@/lib/masterclassDates";

const formatDate = (
  masterclass: Masterclass,
  currentLocale: "pl" | "en"
): string => {
  const locale = currentLocale === "pl" ? pl : enGB;
  if (masterclass.dateType === "single") {
    const date = parseMasterclassDate(masterclass.date);
    const formattedDate = format(date, "PPP", { locale });
    return `${formattedDate}`;
  } else {
    const startDate = parseMasterclassDate(masterclass.date);
    const endDate = parseMasterclassDate(masterclass.dateEnd || masterclass.date);
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
    const todayLocal = startOfLocalDay(new Date());
    return masterclasses.filter((mc) => !isMasterclassPast(mc, todayLocal));
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
          {currentLocale === "pl" ? "Nadchodzące szkolenia" : "Upcoming Trainings"}
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
        {currentLocale === "pl" ? "Nadchodzące szkolenia" : "Upcoming Trainings"}
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
            const mcFont = getMasterclassFontStyle(masterclass.fontFamily);
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
                      <div
                        className="text-center max-w-lg w-full font-normal"
                        style={mcFont}
                      >
                        <h3 className="text-2xl sm:text-3xl font-black mb-5 text-[var(--accent-color)]">
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
                    <div className="space-y-4">
                      {/* Photo Section - First Block */}
                      <div className="relative min-h-[55vh] sm:min-h-[65vh] rounded-2xl overflow-hidden shadow-lg border border-gray-200/60">
                        {/* Background Photo */}
                        <div className="absolute inset-0 z-0">
                          <div className="absolute inset-0 bg-black/50 z-10"></div>
                          <Image
                            src={mainPhoto}
                            alt={masterclass.title[currentLocale]}
                            fill
                            className="object-cover"
                            quality={85}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={index < 2}
                            loading={index < 2 ? "eager" : "lazy"}
                          />
                        </div>
                        
                        {/* Content on Photo - white text: title, date, location */}
                        <div
                          className="relative z-20 text-center p-6 sm:p-10 h-full flex flex-col justify-center font-normal"
                          style={mcFont}
                        >
                          <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 sm:mb-8 drop-shadow-lg line-clamp-2 break-words">
                            {masterclass.title[currentLocale]}
                          </h3>
                          
                          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5">
                            <div className="flex items-center gap-2.5 text-white bg-white/20 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/30">
                              <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                              <span className="font-medium text-base sm:text-lg md:text-xl">{formatDate(masterclass, currentLocale)}</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-white bg-white/20 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/30">
                              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                              <span className="font-medium text-base sm:text-lg md:text-xl">{masterclass.location[currentLocale]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* White block below photo with price, slots and button - Second Block */}
                      <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-200/60">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brown-color)]">
                              {masterclass.price} zł
                            </div>
                            <div className="flex items-center gap-2 text-[var(--accent-color)] bg-gray-50 px-4 py-2 rounded-full border border-gray-200/50">
                              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                              <span className="font-medium text-base sm:text-lg">
                                {(masterclass.availableSlots || 0) -
                                  (masterclass.pickedSlots || 0)}{" "}
                                {currentLocale === "pl"
                                  ? "wolnych miejsc"
                                  : "slots available"}
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/${currentLocale}/masterClass/masterclass-${masterclass.id}`}
                            className={`btn-unified px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg md:text-xl inline-block ${
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
  
  const today = useMemo(() => startOfLocalDay(new Date()), []);

  const calendarInitialized = useRef(false);

  useEffect(() => {
    if (calendarInitialized.current || masterclasses.length === 0) return;

    const viewMonth = new Date().getMonth();
    const viewYear = new Date().getFullYear();
    const hasEventInView = masterclasses.some((mc) =>
      getMasterclassCalendarDays(mc).some(
        (d) => d.getMonth() === viewMonth && d.getFullYear() === viewYear
      )
    );

    if (!hasEventInView) {
      const sorted = sortMasterclassesByStart(masterclasses, "asc");
      const focus =
        sorted.find((mc) => !isMasterclassPast(mc, today)) ||
        sorted[sorted.length - 1];
      const focusDate = getMasterclassStartDate(focus);
      setCalendarMonth(focusDate.getMonth());
      setCalendarYear(focusDate.getFullYear());
    }

    calendarInitialized.current = true;
  }, [masterclasses, today]);

  const eventDates = useMemo(() => {
    const dates: Date[] = [];
    masterclasses.forEach((mc) => {
      dates.push(...getMasterclassCalendarDays(mc));
    });
    return dates;
  }, [masterclasses]);

  const { upcomingMasterclasses, pastMasterclasses, selectedDateMasterclasses } =
    useMemo(() => {
      if (masterclasses.length === 0) {
        return {
          upcomingMasterclasses: [] as Masterclass[],
          pastMasterclasses: [] as Masterclass[],
          selectedDateMasterclasses: [] as Masterclass[],
        };
      }

      if (selectedDate) {
        const matched = masterclasses.filter((mc) =>
          masterclassOccursOnDay(mc, selectedDate)
        );
        return {
          upcomingMasterclasses: [],
          pastMasterclasses: [],
          selectedDateMasterclasses: sortMasterclassesByStart(matched, "asc"),
        };
      }

      const upcoming = sortMasterclassesByStart(
        masterclasses.filter((mc) => !isMasterclassPast(mc, today)),
        "asc"
      );
      const past = sortMasterclassesByStart(
        masterclasses.filter((mc) => isMasterclassPast(mc, today)),
        "desc"
      );

      return {
        upcomingMasterclasses: upcoming,
        pastMasterclasses: past,
        selectedDateMasterclasses: [],
      };
    }, [masterclasses, selectedDate, today]);

  const isMasterclassEnded = (masterclass: Masterclass): boolean =>
    isMasterclassPast(masterclass, today);

  const renderMasterclassCard = (masterclass: Masterclass) => (
    <AnimatedSection key={masterclass.id} direction="left">
      <div className="bg-white rounded-3xl p-8 shadow-lg overflow-hidden">
        <div
          className="text-center mb-6 font-normal"
          style={getMasterclassFontStyle(masterclass.fontFamily)}
        >
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--accent-color)] mb-4 line-clamp-2 break-words">
            {masterclass.title[currentLocale]}
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-[var(--accent-color)] bg-[var(--main-color)]/20 px-4 py-2 rounded-full">
              <Calendar className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium whitespace-nowrap">
                {formatDate(masterclass, currentLocale)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[var(--accent-color)] bg-[var(--main-color)]/20 px-4 py-2 rounded-full max-w-full">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium line-clamp-1 break-words">
                {masterclass.location[currentLocale]}
              </span>
            </div>
            {!isMasterclassEnded(masterclass) && (
              <div className="flex items-center gap-2 text-[var(--accent-color)] bg-[var(--main-color)]/20 px-4 py-2 rounded-full">
                <Users className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium whitespace-nowrap">
                  {(masterclass.availableSlots || 0) -
                    (masterclass.pickedSlots || 0)}{" "}
                  {currentLocale === "pl" ? "wolnych miejsc" : "slots available"}
                </span>
              </div>
            )}
          </div>

          <div className="text-4xl font-bold text-[var(--accent-color)] mb-6">
            {masterclass.price} zł
          </div>

          {isMasterclassEnded(masterclass) ? (
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-2xl p-4">
                <p className="text-gray-600 font-semibold text-lg">
                  {currentLocale === "pl"
                    ? "To wydarzenie się zakończyło"
                    : "This event has ended"}
                </p>
              </div>
              <Link
                href={`/${currentLocale}/masterClass/masterclass-${masterclass.id}`}
                className="btn-unified px-8 py-3 text-base inline-block"
              >
                {currentLocale === "pl" ? "Zobacz szczegóły" : "View details"}
              </Link>
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
  );

  const listIsEmpty =
    selectedDate
      ? selectedDateMasterclasses.length === 0
      : upcomingMasterclasses.length === 0 && pastMasterclasses.length === 0;

  // Format date for display

  // Custom Calendar Component
  const CustomCalendar = () => {
    const locale = currentLocale === "pl" ? pl : enGB;

    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    // getDay(): 0=Sun … 6=Sat → shift so week starts on Monday
    const sundayFirst = new Date(calendarYear, calendarMonth, 1).getDay();
    const firstDayOfMonth = sundayFirst === 0 ? 6 : sundayFirst - 1;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const weekdayFallback = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weekdays = Array.from({ length: 7 }, (_, i) => {
      const dayIndex = ((i + 1) % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6; // Mon…Sun
      return (
        locale.localize?.day(dayIndex, { width: "short" }) ||
        weekdayFallback[i]
      );
    });

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

    const dayHasPastEvent = (date: Date) =>
      masterclasses.some(
        (mc) =>
          masterclassOccursOnDay(mc, date) && isMasterclassPast(mc, today)
      );

    const dayHasUpcomingEvent = (date: Date) =>
      masterclasses.some(
        (mc) =>
          masterclassOccursOnDay(mc, date) && !isMasterclassPast(mc, today)
      );

    return (
      <div className="bg-white rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <p className="text-sm text-gray-600">
            {currentLocale === "pl"
              ? "Kliknij dzień ze szkoleniem (również archiwalne)"
              : "Tap a day with a class (including past events)"}
          </p>
          {selectedDate && (
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="text-sm font-medium text-[var(--brown-color)] underline hover:opacity-80"
            >
              {currentLocale === "pl" ? "Wszystkie terminy" : "All dates"}
            </button>
          )}
        </div>
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
            const isPastDay = startOfLocalDay(date) < today;
            const hasPastEvent = dayHasPastEvent(date);
            const hasUpcomingEvent = dayHasUpcomingEvent(date);
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDate(startOfLocalDay(date))}
                className={`p-2 rounded-full relative min-h-[2.25rem] ${
                  hasUpcomingEvent
                    ? "bg-[var(--accent-color)] text-white font-semibold"
                    : hasPastEvent
                      ? "bg-gray-200 text-gray-700 font-medium"
                      : isToday
                        ? "bg-[var(--brown-color)]/30 text-[var(--brown-color)] font-bold"
                        : isPastDay
                          ? "text-gray-400"
                          : ""
                } ${
                  isSelected ? "ring-2 ring-[var(--brown-color)] ring-offset-1" : ""
                } ${
                  isEventDay
                    ? "hover:opacity-90"
                    : "hover:bg-[var(--brown-color)]/15"
                } transition-all duration-200`}
              >
                {day}
                {isEventDay && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      hasPastEvent && !hasUpcomingEvent
                        ? "bg-gray-500"
                        : "bg-white"
                    }`}
                    aria-hidden
                  />
                )}
                {isToday && !isEventDay && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--brown-color)] rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[var(--accent-color)]" />
            {currentLocale === "pl" ? "Nadchodzące" : "Upcoming"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gray-300" />
            {currentLocale === "pl" ? "Zakończone" : "Past"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className="py-8 relative">
        <div className="absolute -top-20 sm:-top-24 left-1/2 -translate-x-1/2 z-0 w-full flex justify-center pointer-events-none">
          <Image
            src={bread2}
            alt="bread"
            width={600}
            height={600}
            className="w-auto h-92"
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-24 relative z-10">
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
            ) : listIsEmpty ? (
              <p className="lg:col-span-2 self-center text-center text-[var(--accent-color)]">
                {selectedDate
                  ? currentLocale === "pl"
                    ? "Brak warsztatów dla wybranej daty"
                    : "No masterclasses for the selected date"
                  : currentLocale === "pl"
                  ? "Brak warsztatów"
                  : "No masterclasses available"}
              </p>
            ) : (
              <div className="lg:col-span-2 space-y-8">
                {selectedDate ? (
                  <div className="space-y-6">
                    {selectedDateMasterclasses.map((mc) =>
                      renderMasterclassCard(mc)
                    )}
                  </div>
                ) : (
                  <>
                    {upcomingMasterclasses.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-[var(--accent-color)]">
                          {currentLocale === "pl"
                            ? "Nadchodzące szkolenia"
                            : "Upcoming masterclasses"}
                        </h2>
                        <div className="space-y-6">
                          {upcomingMasterclasses.map((mc) =>
                            renderMasterclassCard(mc)
                          )}
                        </div>
                      </div>
                    )}
                    {pastMasterclasses.length > 0 && (
                      <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-600">
                          {currentLocale === "pl"
                            ? "Zakończone szkolenia"
                            : "Past masterclasses"}
                        </h2>
                        <div className="space-y-6">
                          {pastMasterclasses.map((mc) =>
                            renderMasterclassCard(mc)
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

            {/* Right Side: Calendar */}
            <div className="lg:col-span-2 md:order-2 order-1">
              <CustomCalendar />
            </div>
          </div>
        </div>
        
        <SliderSection masterclasses={masterclasses} />
      </div>
    </div>
  );
}
