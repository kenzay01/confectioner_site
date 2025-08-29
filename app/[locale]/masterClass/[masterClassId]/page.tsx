"use client";
import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useItems } from "@/context/itemsContext";
import { format, isBefore } from "date-fns";
import { pl, enGB } from "date-fns/locale";
import { Masterclass } from "@/types/masterclass";
import { ArrowLeft } from "lucide-react";

export default function MasterClassPage() {
  const router = useRouter();
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const { masterclasses, loading, error } = useItems();
  const params = useParams();
  const masterclassId = params.masterClassId as string;
  const [masterclass, setMasterclass] = useState<Masterclass | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today for comparison

  // Find the masterclass by ID
  useEffect(() => {
    if (masterclasses.length > 0) {
      const foundMasterclass = masterclasses.find(
        (mc) => `masterclass-${mc.id}` === masterclassId
      );
      setMasterclass(foundMasterclass || null);
    }
  }, [masterclasses, masterclassId]);

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
            className="mb-4 px-4 py-2 rounded bg-[var(--brown-color)] text-white flex items-center hover:bg-[var(--accent-color)] transition-colors"
            onClick={() => router.back()}
          >
            <ArrowLeft className="inline-block mr-2" />
            {currentLocale === "pl" ? "Powrót" : "Back"}
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-8 text-center">
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
    <div className="md:pt-0 pt-14 min-h-screen bg-[var(--main-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          className="mb-4 px-4 py-2 rounded bg-[var(--brown-color)] text-white flex items-center hover:bg-[var(--accent-color)] transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="inline-block mr-2" />
          {currentLocale === "pl" ? "Powrót" : "Back"}
        </button>
        {/* Main Content: Photo on Left, Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side: Photo/Video */}
          <div className="space-y-6">
            <Image
              src={masterclass.photo || "/placeholder.jpg"}
              alt={masterclass.title[currentLocale]}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-[400px]"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
            />
            {/* {masterclass.video && (
              <video
                controls
                className="w-full rounded-lg"
                src={masterclass.video}
              >
                <source src={masterclass.video} type="video/mp4" />
                {currentLocale === "pl"
                  ? "Twoja przeglądarka nie obsługuje wideo."
                  : "Your browser does not support the video tag."}
              </video>
            )} */}
          </div>

          {/* Right Side: Details */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--brown-color)] mb-4">
                {masterclass.title[currentLocale]}
              </h1>
              <div className="flex items-center gap-2 text-[var(--accent-color)]">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(masterclass)}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--accent-color)]">
                <MapPin className="w-5 h-5" />
                <span>{masterclass.location[currentLocale]}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--accent-color)]">
                <Users className="w-5 h-5" />
                <span>
                  {masterclass.availableSlots - masterclass.pickedSlots}{" "}
                  {currentLocale === "pl"
                    ? "wolnych miejsc"
                    : "slots available"}
                </span>
              </div>
              <div className="text-2xl font-bold text-[var(--brown-color)]">
                {masterclass.price} zł
              </div>
              <p className="text-[var(--brown-color)]">
                {masterclass.description[currentLocale]}
              </p>
              <Link
                href={`/${currentLocale}/payment/masterclass-${masterclass.id}`}
                className={`inline-block px-6 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                  masterclass.availableSlots - masterclass.pickedSlots > 0
                    ? "bg-[var(--brown-color)] hover:bg-[var(--accent-color)]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {masterclass.availableSlots - masterclass.pickedSlots > 0
                  ? currentLocale === "pl"
                    ? "Oplatiti"
                    : "Pay Now"
                  : currentLocale === "pl"
                  ? "Dołącz do listy oczekujących"
                  : "Join Waitlist"}
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--brown-color)] mb-6 text-center">
            {currentLocale === "pl"
              ? "Najczęściej zadawane pytania"
              : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-4">
            {masterclass.faqs && masterclass.faqs[currentLocale]?.length > 0 ? (
              masterclass.faqs[currentLocale].map(
                (item: { question: string; answer: string }, index: number) => (
                  <div
                    key={index}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-[var(--brown-color)]/10"
                  >
                    <h3 className="text-lg font-semibold text-[var(--brown-color)] mb-2">
                      {item.question}
                    </h3>
                    <p className="text-[var(--brown-color)]">{item.answer}</p>
                  </div>
                )
              )
            ) : (
              <p className="text-center text-[var(--accent-color)]">
                {currentLocale === "pl" ? "Brak FAQ" : "No FAQ available"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
