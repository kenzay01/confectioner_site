"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Calendar, MapPin, Users, Plus, Minus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useItems } from "@/context/itemsContext";
import { format, isBefore } from "date-fns";
import { pl, enGB } from "date-fns/locale";
import { Masterclass } from "@/types/masterclass";
import { ArrowLeft } from "lucide-react";
import PaymentModal from "@/components/PaymentModal";
import AnimatedSection from "@/components/AnimatedSection";

export default function MasterClassPage() {
  const router = useRouter();
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { masterclasses, loading, error } = useItems();
  const params = useParams();
  const masterclassId = params.masterClassId as string;
  const [masterclass, setMasterclass] = useState<Masterclass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (masterclasses.length > 0) {
      const foundMasterclass = masterclasses.find(
        (mc) => `masterclass-${mc.id}` === masterclassId
      );
      setMasterclass(foundMasterclass || null);
    }
  }, [masterclasses, masterclassId]);

  const isMasterclassEnded = (masterclass: Masterclass): boolean => {
    const endDate = new Date(masterclass.dateEnd || masterclass.date);
    endDate.setHours(0, 0, 0, 0);
    return isBefore(endDate, today);
  };

  const formatDate = (masterclass: Masterclass): string => {
    const locale = currentLocale === "pl" ? pl : enGB;
    if (masterclass.dateType === "single") {
      const date = new Date(masterclass.date);
      const formattedDate = format(date, "PPP, HH:mm", { locale });
      return `${formattedDate}`;
    } else {
      const startDate = new Date(masterclass.date);
      const endDate = new Date(masterclass.dateEnd || masterclass.date);
      return `${format(startDate, "MMM d, HH:mm", { locale })} - ${format(
        endDate,
        "MMM d, yyyy, HH:mm",
        { locale }
      )}`;
    }
  };

  if (loading) {
    return (
      <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-[var(--accent-color)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !masterclass) {
    return (
      <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-red-500">
            {error ||
              (currentLocale === "pl"
                ? "Warsztat nie znaleziony"
                : "Masterclass not found")}
          </p>
        </div>
      </div>
    );
  }

  if (isMasterclassEnded(masterclass)) {
    return (
      <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            className="mb-4 btn-unified flex items-center"
            onClick={() => router.back()}
          >
            <ArrowLeft className="inline-block mr-2" />
            {currentLocale === "pl" ? "Powrót" : "Back"}
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold  mb-8 text-center">
            {masterclass.title[currentLocale]}
          </h1>
          <p className="text-center text-[var(--accent-color)] text-xl">
            {currentLocale === "pl"
              ? "Ten warsztat nie jest już dostępny"
              : "This masterclass is no longer available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AnimatedSection className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          className="mb-4 btn-unified flex items-center"
          onClick={() => router.back()}
        >
          <ArrowLeft className="inline-block mr-2" />
          {currentLocale === "pl" ? "Powrót" : "Back"}
        </button>

        {/* Header Section with Photo Background - only title, date, location */}
        {masterclass.photo ? (
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg border border-gray-200/60 min-h-[50vh] sm:min-h-[60vh]">
            {/* Background Photo */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/50 z-10"></div>
              <Image
                src={masterclass.photo}
                alt={
                  currentLocale === "pl"
                    ? `Zdjęcie z warsztatu ${masterclass.title[currentLocale]}`
                    : `Photo from masterclass ${masterclass.title[currentLocale]}`
                }
                fill
                className="object-cover"
                priority
                quality={90}
              />
            </div>
            
            {/* Content on Photo - only title, date, location */}
            <div className="relative z-20 text-center p-6 sm:p-10 h-full flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 sm:mb-8 drop-shadow-lg">
                {masterclass.title[currentLocale]}
              </h1>
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                <div className="flex items-center gap-2.5 text-white bg-white/20 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/30">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-medium text-base sm:text-lg md:text-xl">{formatDate(masterclass)}</span>
                </div>
                <div className="flex items-center gap-2.5 text-white bg-white/20 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/30">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="font-medium text-base sm:text-lg md:text-xl">{masterclass.location[currentLocale]}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--accent-color)] mb-5">
              {masterclass.title[currentLocale]}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 text-[var(--accent-color)] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50">
                <Calendar className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base">{formatDate(masterclass)}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--accent-color)] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-gray-200/50">
                <MapPin className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base">{masterclass.location[currentLocale]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Price and Buy Button Section - separate from photo */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm border border-gray-200/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-2">
                {masterclass.price} zł
              </div>
              <div className="flex items-center gap-2 text-[var(--accent-color)]">
                <Users className="w-4 h-4" />
                <span className="text-sm sm:text-base">
                  {masterclass.availableSlots - masterclass.pickedSlots}{" "}
                  {currentLocale === "pl" ? "wolnych miejsc" : "slots available"}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={
                masterclass.availableSlots - masterclass.pickedSlots <= 0
              }
              className={`btn-unified px-8 py-3 text-base sm:text-lg ${
                masterclass.availableSlots - masterclass.pickedSlots > 0
                  ? ""
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {masterclass.availableSlots - masterclass.pickedSlots > 0
                ? currentLocale === "pl"
                  ? "Zapłać"
                  : "Pay Now"
                : currentLocale === "pl"
                ? "Dołącz do listy oczekujących"
                : "Join Waitlist"}
            </button>
          </div>
        </div>
        {/* Description Section */}
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--accent-color)] mb-6 text-center">
            {currentLocale === "pl" ? "Opis" : "Description"}
          </h2>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200/60">
            <p className="whitespace-pre-line text-[var(--accent-color)] text-base sm:text-lg leading-relaxed">
              {masterclass.description[currentLocale]}
            </p>
          </div>
        </div>
        {/* FAQ Section - Accordion with plus icons */}
        {masterclass.faqs && masterclass.faqs[currentLocale]?.length > 0 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--accent-color)] mb-6 text-center">
              {currentLocale === "pl"
                ? "Najczęściej zadawane pytania"
                : "Frequently Asked Questions"}
            </h2>
            <div className="space-y-3">
              {masterclass.faqs[currentLocale].map(
                (item: { question: string; answer: string }, index: number) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50/50 transition-colors"
                    >
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--brown-color)] pr-4">
                        {item.question}
                      </h3>
                      <div className="flex-shrink-0">
                        {openFaqIndex === index ? (
                          <Minus className="w-5 h-5 text-[var(--brown-color)]" />
                        ) : (
                          <Plus className="w-5 h-5 text-[var(--brown-color)]" />
                        )}
                      </div>
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                        <div className="pt-4 border-t border-gray-200/60">
                          <p className="text-[var(--accent-color)] text-base sm:text-lg leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={{
            type: "masterclass",
            id: masterclassId,
            title: masterclass.title,
            price: masterclass.price,
            description: masterclass.description,
          }}
        />
      </div>
    </AnimatedSection>
  );
}
