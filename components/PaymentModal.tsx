"use client";
import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    type: "masterclass" | "product";
    id: string;
    title: { pl: string; en: string };
    price: number;
    description: { pl: string; en: string };
  };
}

export default function PaymentModal({
  isOpen,
  onClose,
  item,
}: PaymentModalProps) {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const router = useRouter();
  const [page, setPage] = useState<"info" | "form">("info");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    workplace: "",
    profession: "",
    invoiceNeeded: false,
    companyName: "",
    nip: "",
    companyAddress: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName) {
      newErrors.fullName =
        currentLocale === "pl"
          ? "Podaj imię i nazwisko"
          : "Please enter your full name";
    }
    if (!formData.email) {
      newErrors.email =
        currentLocale === "pl" ? "Podaj email" : "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email =
        currentLocale === "pl"
          ? "Nieprawidłowy format email"
          : "Invalid email format";
    }
    if (!formData.whatsapp) {
      newErrors.whatsapp =
        currentLocale === "pl"
          ? "Podaj numer WhatsApp"
          : "Please enter your WhatsApp number";
    } else if (!/^\+?\d{9,15}$/.test(formData.whatsapp)) {
      newErrors.whatsapp =
        currentLocale === "pl"
          ? "Nieprawidłowy format numeru"
          : "Invalid phone number format";
    }
    if (formData.invoiceNeeded) {
      if (!formData.companyName) {
        newErrors.companyName =
          currentLocale === "pl"
            ? "Podaj nazwę firmy"
            : "Please enter company name";
      }
      if (!formData.nip) {
        newErrors.nip =
          currentLocale === "pl"
            ? "Podaj numer NIP"
            : "Please enter tax number (NIP)";
      }
      if (!formData.companyAddress) {
        newErrors.companyAddress =
          currentLocale === "pl"
            ? "Podaj adres firmy"
            : "Please enter company address";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, invoiceNeeded: e.target.checked });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const paymentData = {
        timestamp: new Date().toLocaleString("uk-UA", {
          timeZone: "Europe/Kiev",
        }),
        itemType: item.type,
        itemId: item.id,
        ...formData,
      };
      const existingPayments = JSON.parse(
        localStorage.getItem("payments") || "[]"
      );
      existingPayments.push(paymentData);
      localStorage.setItem("payments", JSON.stringify(existingPayments));

      setStatus("success");
      setFormData({
        fullName: "",
        email: "",
        whatsapp: "",
        workplace: "",
        profession: "",
        invoiceNeeded: false,
        companyName: "",
        nip: "",
        companyAddress: "",
      });

      setTimeout(() => {
        // window.location.href = `https://payment-provider.com/pay?item=${item.type}&id=${item.id}&amount=${item.price}`;
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative transition-all duration-300 ${
          item.type === "masterclass"
            ? "border-l-4 border-[var(--accent-color)]"
            : "border-l-4 border-[var(--brown-color)]"
        }`}
      >
        <button
          onClick={() => {
            onClose();
            setPage("info");
            setErrors({});
          }}
          className="absolute top-4 right-4  hover:text-[var(--accent-color)] z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {page === "info" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  item.type === "masterclass"
                    ? "bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                    : "bg-[var(--brown-color)]/10 "
                }`}
              >
                {item.type === "masterclass"
                  ? currentLocale === "pl"
                    ? "Masterclass"
                    : "Masterclass"
                  : currentLocale === "pl"
                  ? "Produkt"
                  : "Product"}
              </span>
              <h2 className="text-2xl font-bold ">
                {item.title[currentLocale]}
              </h2>
            </div>
            <p className=" font-medium">
              {currentLocale === "pl" ? "Cena:" : "Price:"} {item.price} zł
            </p>
            <div className=" whitespace-pre-line line-clamp-6">
              {item.type === "masterclass" ? (
                <>
                  <p className="font-semibold">
                    {currentLocale === "pl"
                      ? "Czego się nauczysz:"
                      : "What you'll learn:"}
                  </p>
                  <p>{item.description[currentLocale]}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold">
                    {currentLocale === "pl"
                      ? "Opis produktu:"
                      : "Product Description:"}
                  </p>
                  <p>{item.description[currentLocale]}</p>
                </>
              )}
            </div>
            <button
              onClick={() => setPage("form")}
              className="w-full px-6 py-3 rounded-full font-bold text-white bg-[var(--brown-color)] hover:bg-[var(--accent-color)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {currentLocale === "pl"
                ? item.type === "masterclass"
                  ? "Zapisz się na Masterclass"
                  : "Kup Produkt"
                : item.type === "masterclass"
                ? "Join Masterclass"
                : "Buy Product"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold ">
              {currentLocale === "pl" ? "Dane do płatności" : "Payment Details"}
            </h2>
            <div className="grid gap-4">
              <div>
                <label className="block  font-medium mb-1">
                  {currentLocale === "pl" ? "Imię i nazwisko" : "Full Name"}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                  placeholder={
                    currentLocale === "pl"
                      ? "Twoje imię i nazwisko"
                      : "Your full name"
                  }
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block  font-medium mb-1">
                  {currentLocale === "pl" ? "Email" : "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder={
                    currentLocale === "pl" ? "Twój email" : "Your email"
                  }
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block  font-medium mb-1">
                  {currentLocale === "pl"
                    ? "Numer WhatsApp"
                    : "WhatsApp Number"}
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className={`w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                    errors.whatsapp ? "border-red-500" : ""
                  }`}
                  placeholder={
                    currentLocale === "pl"
                      ? "+48 123 456 789"
                      : "+48 123 456 789"
                  }
                />
                {errors.whatsapp && (
                  <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>
                )}
              </div>
              <div>
                <label className="block  font-medium mb-1">
                  {currentLocale === "pl" ? "Miejsce pracy" : "Workplace"}
                </label>
                <input
                  type="text"
                  name="workplace"
                  value={formData.workplace}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600"
                  placeholder={
                    currentLocale === "pl"
                      ? "Twoje miejsce pracy"
                      : "Your workplace"
                  }
                />
              </div>
              <div>
                <label className="block  font-medium mb-1">
                  {currentLocale === "pl" ? "Zawód" : "Profession"}
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600"
                  placeholder={
                    currentLocale === "pl" ? "Twój zawód" : "Your profession"
                  }
                />
              </div>
              <div>
                <label className="flex items-center gap-2  font-medium mb-1">
                  <input
                    type="checkbox"
                    name="invoiceNeeded"
                    checked={formData.invoiceNeeded}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4"
                  />
                  {currentLocale === "pl"
                    ? "Czy potrzebna faktura?"
                    : "Invoice Needed?"}
                </label>
              </div>
              {formData.invoiceNeeded && (
                <div className="grid gap-4 transition-all duration-300">
                  <div>
                    <label className="block  font-medium mb-1">
                      {currentLocale === "pl" ? "Nazwa firmy" : "Company Name"}
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                        errors.companyName ? "border-red-500" : ""
                      }`}
                      placeholder={
                        currentLocale === "pl" ? "Nazwa firmy" : "Company name"
                      }
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block  font-medium mb-1">
                      {currentLocale === "pl"
                        ? "Numer NIP"
                        : "Tax Number (NIP)"}
                    </label>
                    <input
                      type="text"
                      name="nip"
                      value={formData.nip}
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                        errors.nip ? "border-red-500" : ""
                      }`}
                      placeholder={
                        currentLocale === "pl" ? "Numer NIP" : "Tax number"
                      }
                    />
                    {errors.nip && (
                      <p className="text-red-500 text-sm mt-1">{errors.nip}</p>
                    )}
                  </div>
                  <div>
                    <label className="block  font-medium mb-1">
                      {currentLocale === "pl"
                        ? "Adres firmy"
                        : "Company Address"}
                    </label>
                    <input
                      type="text"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      className={`w-full p-2 rounded-lg border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                        errors.companyAddress ? "border-red-500" : ""
                      }`}
                      placeholder={
                        currentLocale === "pl"
                          ? "Adres firmy"
                          : "Company address"
                      }
                    />
                    {errors.companyAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyAddress}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify- gap-4">
                <button
                  onClick={() => setPage("info")}
                  className="flex-1 px-4 py-2 rounded font-bold  border border-[var(--brown-color)] hover:bg-[var(--brown-color)] hover:text-white transition-all duration-300"
                >
                  {currentLocale === "pl" ? "Powrót" : "Back"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className={`flex-1 px-6 py-3 rounded-full font-bold text-white bg-[var(--brown-color)] hover:bg-[var(--accent-color)] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    status === "loading" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {status === "loading"
                    ? currentLocale === "pl"
                      ? "Wysyłanie..."
                      : "Sending..."
                    : currentLocale === "pl"
                    ? "Oplatiti"
                    : "Pay Now"}
                </button>
              </div>
              {status === "success" && (
                <p className="text-green-600 text-center">
                  {currentLocale === "pl"
                    ? "Dane zapisane pomyślnie! Przekierowanie do płatności..."
                    : "Data saved successfully! Redirecting to payment..."}
                </p>
              )}
              {status === "error" && (
                <p className="text-red-500 text-center">
                  {currentLocale === "pl"
                    ? "Błąd podczas zapisywania danych. Spróbuj ponownie."
                    : "Error saving data. Please try again."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
