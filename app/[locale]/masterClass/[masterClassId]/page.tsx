"use client";
import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { Calendar, MapPin, Users } from "lucide-react";
import Image from "next/image";
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
            className="mb-4 px-4 py-2 rounded bg-[var(--brown-color)] text-white flex items-center hover:bg-[var(--accent-color)] transition-colors"
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
          className="mb-4 px-4 py-2 rounded bg-[var(--brown-color)] text-white flex items-center hover:bg-[var(--accent-color)] transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft className="inline-block mr-2" />
          {currentLocale === "pl" ? "Powrót" : "Back"}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <Image
              src={masterclass.photo || "/placeholder.jpg"}
              alt={masterclass.title[currentLocale]}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full h-[400px]"
              placeholder="blur"
              blurDataURL="/placeholder.jpg"
              priority
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6  ">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold  mb-4">
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
              <div className="text-2xl font-bold ">{masterclass.price} zł</div>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={
                  masterclass.availableSlots - masterclass.pickedSlots <= 0
                }
                className={`inline-block px-6 py-3 rounded-full font-bold text-white transition-all duration-300 transform hover:scale-105  hover:shadow-xl ${
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
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold  mb-6 text-center">
            {currentLocale === "pl" ? "Opis" : "Description"}
          </h2>
          <p className="whitespace-pre-line text-[var(--accent-color)]">
            {masterclass.description[currentLocale]}
          </p>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold  mb-6 text-center">
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
                    className="bg-white/95 backdrop-blur-sm rounded-3xl p-6  "
                  >
                    <h3 className="text-lg font-semibold  mb-2">
                      {item.question}
                    </h3>
                    <p className="">{item.answer}</p>
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
