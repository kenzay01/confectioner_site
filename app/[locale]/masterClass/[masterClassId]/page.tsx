"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Calendar, MapPin, Users, Plus, Minus, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [photoGallery, setPhotoGallery] = useState<{
    photos: string[];
    index: number;
    title: string;
  } | null>(null);
  const [waitlistForm, setWaitlistForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
                : "Workshop not found")}
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
              : "This workshop is no longer available"}
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
        {(() => {
          const photos = masterclass.photos || (masterclass.photo ? [masterclass.photo] : []);
          const mainPhoto = photos[0];
          if (mainPhoto) {
            return (
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg border border-gray-200/60 min-h-[50vh] sm:min-h-[60vh]">
            {/* Background Photo */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/50 z-10"></div>
              <Image
                  src={mainPhoto}
                alt={
                  currentLocale === "pl"
                    ? `Zdjęcie z warsztatu ${masterclass.title[currentLocale]}`
                      : `Photo from workshop ${masterclass.title[currentLocale]}`
                }
                fill
                  className="object-cover cursor-pointer"
                priority
                quality={85}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  onClick={() => photos.length > 0 && setPhotoGallery({ photos, index: 0, title: masterclass.title[currentLocale] })}
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
            );
          }
          return (
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
          );
        })()}

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
              onClick={() => {
                if (masterclass.availableSlots - masterclass.pickedSlots > 0) {
                  setIsModalOpen(true);
                } else {
                  setIsWaitlistOpen(true);
              }
              }}
              className="btn-unified px-8 py-3 text-base sm:text-lg"
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
        {/* Photo Gallery Section */}
        {(() => {
          const photos = masterclass.photos || (masterclass.photo ? [masterclass.photo] : []);
          const extraPhotos = photos.slice(1);
          if (extraPhotos.length === 0) return null;
          return (
            <div className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--accent-color)] mb-6 text-center">
                {currentLocale === "pl" ? "Galeria zdjęć" : "Photo Gallery"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {extraPhotos.map((photo, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPhotoGallery({ photos, index: index + 1, title: masterclass.title[currentLocale] })}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[var(--brown-color)] transition-colors group"
                  >
                    <Image
                      src={photo}
                      alt={`${masterclass.title[currentLocale]} - ${index + 2}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      loading={index < 4 ? "eager" : "lazy"}
                      quality={75}
                    />
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
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
        {/* Waitlist Modal */}
        {isWaitlistOpen && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsWaitlistOpen(false);
                setWaitlistForm({ fullName: "", email: "", phone: "", message: "" });
                setWaitlistStatus("idle");
              }
            }}
          >
            <div 
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setIsWaitlistOpen(false);
                  setWaitlistForm({ fullName: "", email: "", phone: "", message: "" });
                  setWaitlistStatus("idle");
                }}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--accent-color)] mb-6">
                {currentLocale === "pl"
                  ? "Dołącz do listy oczekujących"
                  : "Join Waitlist"}
              </h2>
              {waitlistStatus === "success" ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <p className="text-lg text-[var(--accent-color)]">
                    {currentLocale === "pl"
                      ? "Dziękujemy! Twoja prośba została wysłana. Skontaktujemy się z Tobą, gdy pojawią się wolne miejsca."
                      : "Thank you! Your request has been sent. We will contact you when spots become available."}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setWaitlistStatus("loading");
                    try {
                      const response = await fetch("/api/send-email", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          subject: currentLocale === "pl"
                            ? `Nowa prośba o dołączenie do listy oczekujących - ${masterclass.title[currentLocale]}`
                            : `New waitlist request - ${masterclass.title[currentLocale]}`,
                          html: `
                            <h2>${currentLocale === "pl" ? "Nowa prośba o dołączenie do listy oczekujących" : "New Waitlist Request"}</h2>
                            <p><strong>${currentLocale === "pl" ? "Warsztat" : "Workshop"}:</strong> ${masterclass.title[currentLocale]}</p>
                            <p><strong>${currentLocale === "pl" ? "Imię i nazwisko" : "Full Name"}:</strong> ${waitlistForm.fullName}</p>
                            <p><strong>Email:</strong> ${waitlistForm.email}</p>
                            <p><strong>${currentLocale === "pl" ? "Telefon" : "Phone"}:</strong> ${waitlistForm.phone}</p>
                            ${waitlistForm.message ? `<p><strong>${currentLocale === "pl" ? "Wiadomość" : "Message"}:</strong> ${waitlistForm.message}</p>` : ""}
                          `,
                        }),
                      });
                      if (response.ok) {
                        setWaitlistStatus("success");
                        setTimeout(() => {
                          setIsWaitlistOpen(false);
                          setWaitlistForm({ fullName: "", email: "", phone: "", message: "" });
                          setWaitlistStatus("idle");
                        }, 3000);
                      } else {
                        setWaitlistStatus("error");
                      }
                    } catch (error) {
                      setWaitlistStatus("error");
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentLocale === "pl" ? "Imię i nazwisko" : "Full Name"} *
                    </label>
                    <input
                      type="text"
                      required
                      value={waitlistForm.fullName}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, fullName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brown-color)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={waitlistForm.email}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brown-color)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentLocale === "pl" ? "Telefon" : "Phone"} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={waitlistForm.phone}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brown-color)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {currentLocale === "pl" ? "Wiadomość (opcjonalnie)" : "Message (optional)"}
                    </label>
                    <textarea
                      value={waitlistForm.message}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brown-color)] focus:border-transparent"
                    />
                  </div>
                  {waitlistStatus === "error" && (
                    <p className="text-red-500 text-sm">
                      {currentLocale === "pl"
                        ? "Wystąpił błąd. Spróbuj ponownie."
                        : "An error occurred. Please try again."}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={waitlistStatus === "loading"}
                    className="w-full btn-unified px-6 py-3 text-base sm:text-lg disabled:opacity-50"
                  >
                    {waitlistStatus === "loading"
                      ? currentLocale === "pl"
                        ? "Wysyłanie..."
                        : "Sending..."
                      : currentLocale === "pl"
                      ? "Wyślij prośbę"
                      : "Send Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
        {/* Photo Gallery Modal */}
        {photoGallery && (
          <div 
            className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
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
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  quality={85}
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
                        sizes="(max-width: 640px) 16vw, 10vw"
                        loading="lazy"
                        quality={60}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
