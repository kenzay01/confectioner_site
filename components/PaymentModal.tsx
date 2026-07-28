"use client";
import { useState, useEffect } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";
import { X } from "lucide-react";
import type { CartCheckoutItem } from "@/types/cart";

interface SingleItem {
  type: "masterclass" | "product";
  id: string;
  title: { pl: string; en: string };
  price: number;
  description?: { pl: string; en: string };
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Single-item checkout (legacy) */
  item?: SingleItem;
  /** Multi-item cart checkout */
  cartItems?: CartCheckoutItem[];
  /** Called after payment is created successfully (before redirect) */
  onPaymentCreated?: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  item,
  cartItems,
  onPaymentCreated,
}: PaymentModalProps) {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const isCartCheckout = Boolean(cartItems && cartItems.length > 0);
  const lineItems: CartCheckoutItem[] = isCartCheckout
    ? cartItems!
    : item
      ? [
          {
            type: item.type,
            id: item.id.replace(/^masterclass-/, "").replace(/^product-/, ""),
            title: item.title,
            price: item.price,
            quantity: 1,
          },
        ]
      : [];

  const totalAmount = lineItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const [page, setPage] = useState<"info" | "form">(
    isCartCheckout ? "form" : "info"
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    invoiceNeeded: false,
    companyName: "",
    nip: "",
    companyAddress: "",
    regulationAccepted: false,
    imageConsent: "" as "agree" | "disagree" | "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setPage(isCartCheckout ? "form" : "info");
    }
  }, [isOpen, isCartCheckout]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.fullName) {
      newErrors.fullName =
        currentLocale === "pl"
          ? "To pole jest wymagane"
          : "This field is required";
    }
    if (!formData.email) {
      newErrors.email =
        currentLocale === "pl" ? "To pole jest wymagane" : "This field is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email =
        currentLocale === "pl"
          ? "Nieprawidłowy format email"
          : "Invalid email format";
    }
    if (!formData.phone) {
      newErrors.phone =
        currentLocale === "pl"
          ? "To pole jest wymagane"
          : "This field is required";
    } else if (!/^\+?\d{7,15}$/.test(formData.phone)) {
      newErrors.phone =
        currentLocale === "pl"
          ? "Nieprawidłowy format numeru"
          : "Invalid phone number format";
    }
    if (!formData.city) {
      newErrors.city =
        currentLocale === "pl" ? "To pole jest wymagane" : "This field is required";
    }
    if (!formData.regulationAccepted) {
      newErrors.regulationAccepted =
        currentLocale === "pl"
          ? "Aby kontynuować, prosimy o akceptację regulaminu"
          : "Please accept the regulation to continue";
    }
    if (formData.invoiceNeeded) {
      if (!formData.companyName) {
        newErrors.companyName =
          currentLocale === "pl"
            ? "To pole jest wymagane"
            : "This field is required";
      }
      if (!formData.nip) {
        newErrors.nip =
          currentLocale === "pl"
            ? "To pole jest wymagane"
            : "This field is required";
      }
      if (!formData.companyAddress) {
        newErrors.companyAddress =
          currentLocale === "pl"
            ? "To pole jest wymagane"
            : "This field is required";
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
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async () => {
    if (!validateForm() || lineItems.length === 0) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const primary = lineItems[0];
      const sessionId = isCartCheckout
        ? `cart_${Date.now()}`
        : `${primary.type}_${primary.type === "masterclass" ? `masterclass-${primary.id}` : primary.id}_${Date.now()}`;

      const itemTitle = isCartCheckout
        ? lineItems
            .map(
              (i) =>
                `${i.title[currentLocale]} ×${i.quantity}`
            )
            .join(", ")
        : primary.title[currentLocale];

      const paymentData = {
        sessionId,
        itemType: isCartCheckout ? "cart" : primary.type,
        itemId: isCartCheckout
          ? "cart"
          : primary.type === "masterclass"
            ? `masterclass-${primary.id}`
            : primary.id,
        itemTitle,
        cartItems: lineItems,
        formData,
        price: totalAmount,
        amount: totalAmount,
        timestamp: Date.now(),
      };

      localStorage.setItem("paymentData", JSON.stringify(paymentData));

      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          itemType: isCartCheckout ? "cart" : primary.type,
          itemId: isCartCheckout
            ? "cart"
            : primary.type === "masterclass"
              ? `masterclass-${primary.id}`
              : primary.id,
          sessionId,
          cartItems: lineItems,
          email: formData.email,
          fullName: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          imageConsent: formData.imageConsent,
          invoiceNeeded: formData.invoiceNeeded,
          companyName: formData.companyName || "",
          nip: formData.nip || "",
          companyAddress: formData.companyAddress || "",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        onPaymentCreated?.();

        localStorage.setItem(
          "paymentData",
          JSON.stringify({
            ...paymentData,
            token: result.token,
          })
        );

        setTimeout(() => {
          window.location.href = result.paymentUrl;
        }, 1000);
      } else {
        throw new Error(result.error || "Failed to create payment");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      setStatus("error");

      alert(
        currentLocale === "pl"
          ? "Błąd podczas tworzenia płatności. Spróbuj ponownie."
          : "Error creating payment. Please try again."
      );

      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const resetModal = () => {
    setPage(isCartCheckout ? "form" : "info");
    setErrors({});
    setStatus("idle");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      city: "",
      invoiceNeeded: false,
      companyName: "",
      nip: "",
      companyAddress: "",
      regulationAccepted: false,
      imageConsent: "",
    });
  };

  if (!isOpen || lineItems.length === 0) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
          resetModal();
        }
      }}
    >
      <div
        className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto relative transition-all duration-300 border-l-4 border-[var(--accent-color)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            onClose();
            resetModal();
          }}
          className="absolute top-4 right-4 hover:text-[var(--accent-color)] z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {page === "info" && !isCartCheckout && item ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-[var(--accent-color)]/10 text-[var(--accent-color)]">
                {item.type === "masterclass"
                  ? "Masterclass"
                  : currentLocale === "pl"
                    ? "Produkt"
                    : "Product"}
              </span>
              <h2 className="text-2xl font-bold">
                {item.title[currentLocale]}
              </h2>
            </div>
            <p className="font-medium">
              {currentLocale === "pl" ? "Cena:" : "Price:"} {item.price} zł
            </p>
            {item.description && (
              <div className="whitespace-pre-line line-clamp-6">
                <p className="font-semibold">
                  {currentLocale === "pl"
                    ? "Czego się nauczysz:"
                    : "What you'll learn:"}
                </p>
                <p>{item.description[currentLocale]}</p>
              </div>
            )}
            <button
              onClick={() => setPage("form")}
              className="w-full btn-unified"
            >
              {currentLocale === "pl" ? "Weź udział" : "Join"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              {currentLocale === "pl" ? "Dane do płatności" : "Payment Details"}
            </h2>

            <div className="bg-[var(--main-color)]/40 rounded-xl p-3 space-y-1 text-sm">
              {lineItems.map((li) => (
                <div
                  key={`${li.type}-${li.id}`}
                  className="flex justify-between gap-2"
                >
                  <span>
                    {li.title[currentLocale]}
                    {li.quantity > 1 ? ` ×${li.quantity}` : ""}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {li.price * li.quantity} zł
                  </span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2 border-t border-black/10">
                <span>{currentLocale === "pl" ? "Suma" : "Total"}</span>
                <span>{totalAmount} zł</span>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block font-medium mb-1">
                  {currentLocale === "pl" ? "Imię i nazwisko" : "Full Name"}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full p-2 input-unified border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                    errors.fullName ? "border-red-500" : ""
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-2 input-unified border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">
                  {currentLocale === "pl"
                    ? "Wprowadź numer Telefonu"
                    : "Phone number"}
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full p-2 input-unified border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">
                  {currentLocale === "pl"
                    ? "Miasto (lub kod pocztowy)"
                    : "City"}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full p-2 input-unified border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                    errors.city ? "border-red-500" : ""
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 font-medium mb-1">
                  <input
                    type="checkbox"
                    name="invoiceNeeded"
                    checked={formData.invoiceNeeded}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4"
                  />
                  {currentLocale === "pl"
                    ? "Chcę otrzymać fakturę VAT"
                    : "I want VAT invoice"}
                </label>
              </div>
              {formData.invoiceNeeded && (
                <div className="grid gap-4 transition-all duration-300">
                  <div>
                    <label className="block font-medium mb-1">
                      {currentLocale === "pl" ? "Nazwa firmy" : "Company Name"}
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full p-2 input-unified border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                        errors.companyName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      {currentLocale === "pl"
                        ? "Numer NIP"
                        : "Tax Number (NIP)"}
                    </label>
                    <input
                      type="text"
                      name="nip"
                      value={formData.nip}
                      onChange={handleInputChange}
                      className={`w-full p-2 input-unified border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                        errors.nip ? "border-red-500" : ""
                      }`}
                    />
                    {errors.nip && (
                      <p className="text-red-500 text-sm mt-1">{errors.nip}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      {currentLocale === "pl"
                        ? "Adres firmy"
                        : "Company Address"}
                    </label>
                    <input
                      type="text"
                      name="companyAddress"
                      value={formData.companyAddress}
                      onChange={handleInputChange}
                      className={`w-full p-2 input-unified border border-[var(--brown-color)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-gray-600 ${
                        errors.companyAddress ? "border-red-500" : ""
                      }`}
                    />
                    {errors.companyAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyAddress}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-medium mb-2">
                  {currentLocale === "pl" ? "Regulamin" : "Regulation"}*
                </label>
                <label className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    name="regulationAccepted"
                    checked={formData.regulationAccepted}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4"
                  />
                  <span>
                    {currentLocale === "pl"
                      ? "Zapoznałem się oraz akceptuję Regulamin, Oświadczenie na temat przetwarzania danych osobowych oraz Politykę prywatności"
                      : "I have read and accept the Terms and Privacy Policy"}
                  </span>
                </label>
                {errors.regulationAccepted && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.regulationAccepted}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-2">
                  {currentLocale === "pl"
                    ? "Udostępnienie wizerunku"
                    : "Image consent"}
                </label>
                <div className="grid gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="imageConsent"
                      value="agree"
                      checked={formData.imageConsent === "agree"}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          imageConsent: e.target.value as "agree" | "disagree",
                        });
                        setErrors({ ...errors, imageConsent: "" });
                      }}
                    />
                    <span>
                      {currentLocale === "pl"
                        ? "Wyrażam zgodę na ud. wizerunku"
                        : "I agree"}
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="imageConsent"
                      value="disagree"
                      checked={formData.imageConsent === "disagree"}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          imageConsent: e.target.value as "agree" | "disagree",
                        });
                        setErrors({ ...errors, imageConsent: "" });
                      }}
                    />
                    <span>
                      {currentLocale === "pl"
                        ? "Nie wyrażam zgody na ud. wizerunku"
                        : "I do not agree"}
                    </span>
                  </label>
                </div>
              </div>
              <div className="flex justify-between gap-4">
                {!isCartCheckout && (
                  <button
                    onClick={() => setPage("info")}
                    className="flex-1 btn-unified"
                    disabled={status === "loading"}
                  >
                    {currentLocale === "pl" ? "Powrót" : "Back"}
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className={`flex-1 btn-unified ${
                    status === "loading" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {status === "loading"
                    ? currentLocale === "pl"
                      ? "Tworzenie płatności..."
                      : "Creating payment..."
                    : currentLocale === "pl"
                      ? "Opłać"
                      : "Pay now"}
                </button>
              </div>
              {status === "success" && (
                <p className="text-green-600 text-center">
                  {currentLocale === "pl"
                    ? "Przekierowanie do płatności..."
                    : "Redirecting to payment..."}
                </p>
              )}
              {status === "error" && (
                <p className="text-red-500 text-center">
                  {currentLocale === "pl"
                    ? "Sprawdź wszystkie pola i spróbuj ponownie."
                    : "Please check all fields and try again."}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
