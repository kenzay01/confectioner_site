"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

interface PaymentData {
  sessionId: string;
  itemType: "masterclass" | "product";
  itemId: string;
  itemTitle: string;
  formData: {
    fullName: string;
    email: string;
    whatsapp: string;
    workplace: string;
    profession: string;
    invoiceNeeded: boolean;
    companyName: string;
    nip: string;
    companyAddress: string;
  };
  price: number;
  amount: number;
  timestamp: number;
  token?: string;
}

type PaymentStatus =
  | "success"
  | "failure" 
  | "processing"
  | "created"
  | "reversed"
  | "not_found"
  | "unknown";

function PaymentStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("processing");
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processed, setProcessed] = useState(false);

  const texts = {
    pl: {
      title: "Status płatności",
      statuses: {
        success: {
          title: "Płatność zakończona sukcesem!",
          message: "Twoje zamówienie zostało potwierdzone. Otrzymasz wkrótce szczegóły na podany email.",
        },
        failure: {
          title: "Płatność nieudana",
          message: "Niestety, płatność nie została zakończona. Możesz spróbować ponownie.",
        },
        processing: {
          title: "Płatność w trakcie",
          message: "Twoja płatność jest przetwarzana. Proszę czekać...",
        },
        created: {
          title: "Płatność utworzona",
          message: "Płatność została utworzona, ale jeszcze nie przetworzona.",
        },
        reversed: {
          title: "Płatność anulowana",
          message: "Płatność została anulowana i zwrócona.",
        },
        not_found: {
          title: "Płatność nie znaleziona",
          message: "Nie znaleziono informacji o tej płatności.",
        },
        unknown: {
          title: "Nieznany status",
          message: "Nie można określić statusu płatności.",
        },
      },
      buttons: {
        retry: "Spróbuj ponownie",
        home: "Powrót do strony głównej",
        refresh: "Odśwież status",
      },
      labels: {
        orderDetails: "Szczegóły zamówienia",
        type: "Typ",
        item: "Przedmiot",
        name: "Imię i nazwisko",
        email: "Email",
        phone: "Telefon",
        amount: "Kwota",
        sessionId: "ID sesji",
        masterclass: "Masterclass",
        product: "Produkt",
      },
      errors: {
        noData: "Brak danych o płatności",
        expired: "Dane płatności wygasły",
        processing: "Błąd podczas przetwarzania płatności",
      }
    },
    en: {
      title: "Payment Status",
      statuses: {
        success: {
          title: "Payment Successful!",
          message: "Your order has been confirmed. You will receive details via email shortly.",
        },
        failure: {
          title: "Payment Failed",
          message: "Unfortunately, the payment was not completed. You can try again.",
        },
        processing: {
          title: "Payment Processing",
          message: "Your payment is being processed. Please wait...",
        },
        created: {
          title: "Payment Created",
          message: "Payment has been created but not yet processed.",
        },
        reversed: {
          title: "Payment Cancelled",
          message: "Payment has been cancelled and refunded.",
        },
        not_found: {
          title: "Payment Not Found",
          message: "No information found about this payment.",
        },
        unknown: {
          title: "Unknown Status",
          message: "Unable to determine payment status.",
        },
      },
      buttons: {
        retry: "Try Again",
        home: "Return to Home",
        refresh: "Refresh Status",
      },
      labels: {
        orderDetails: "Order Details",
        type: "Type",
        item: "Item",
        name: "Full Name",
        email: "Email",
        phone: "Phone",
        amount: "Amount",
        sessionId: "Session ID",
        masterclass: "Masterclass",
        product: "Product",
      },
      errors: {
        noData: "No payment data found",
        expired: "Payment data expired",
        processing: "Error processing payment",
      }
    }
  };

  const t = texts[currentLocale];

  useEffect(() => {
    const sessionId = searchParams.get('sessionId');
    const storedData = localStorage.getItem("paymentData");
    
    if (storedData) {
      const parsedData: PaymentData = JSON.parse(storedData);
      setPaymentData(parsedData);

      // Перевіряємо, чи дані не застарілі (24 години)
      const now = Date.now();
      const hoursPassed = (now - parsedData.timestamp) / (1000 * 60 * 60);
      
      if (hoursPassed > 24) {
        localStorage.removeItem("paymentData");
        setError(t.errors.expired);
        setLoading(false);
        return;
      }

      const checkPaymentStatus = async () => {
        const sessionIdToCheck = sessionId || parsedData.sessionId;
        
        if (sessionIdToCheck) {
          try {
            const response = await fetch(`/api/payment-status?sessionId=${sessionIdToCheck}`);
            const result = await response.json();
            
            if (result.success) {
              setPaymentStatus(result.status);
              
              // Якщо платіж успішний і ще не оброблено, обробляємо його
              if (result.status === 'success' && !processed) {
                await handleSuccessfulPayment(parsedData);
                setProcessed(true);
              }
            } else {
              setError(`${t.errors.processing}: ${result.error}`);
            }
          } catch (error) {
            console.error('Error checking payment status:', error);
            setError(t.errors.processing);
          }
        } else {
          setError(t.errors.noData);
        }
        setLoading(false);
      };

      checkPaymentStatus();
    } else {
      setError(t.errors.noData);
      setLoading(false);
    }
  }, [searchParams, processed, t]);

  const handleSuccessfulPayment = async (data: PaymentData) => {
    try {
      // Обробляємо успішний платіж
      await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: data.sessionId,
          itemType: data.itemType,
          itemId: data.itemId,
          formData: data.formData,
          amount: data.amount,
          status: 'success',
        }),
      });

      // Видаляємо дані з localStorage після успішної обробки
      localStorage.removeItem("paymentData");
    } catch (error) {
      console.error('Error processing successful payment:', error);
    }
  };

  const handleRetryPayment = async () => {
    if (!paymentData) return;

    try {
      const newSessionId = `${paymentData.itemType}_${paymentData.itemId}_${Date.now()}`;
      
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentData.amount,
          itemType: paymentData.itemType,
          itemId: paymentData.itemId,
          sessionId: newSessionId,
          email: paymentData.formData.email,
          fullName: paymentData.formData.fullName,
          whatsapp: paymentData.formData.whatsapp,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const updatedData = {
          ...paymentData,
          sessionId: newSessionId,
          token: result.token,
          timestamp: Date.now(),
        };
        localStorage.setItem("paymentData", JSON.stringify(updatedData));
        window.location.href = result.paymentUrl;
      } else {
        alert(`${t.errors.processing}: ${result.error}`);
      }
    } catch (error) {
      console.error('Error retrying payment:', error);
      alert(t.errors.processing);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case "failure":
        return <XCircle className="w-16 h-16 text-red-500" />;
      case "processing":
        return <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />;
      case "created":
        return <CreditCard className="w-16 h-16 text-blue-500" />;
      case "reversed":
        return <XCircle className="w-16 h-16 text-orange-500" />;
      case "not_found":
        return <AlertCircle className="w-16 h-16 text-gray-500" />;
      default:
        return <AlertCircle className="w-16 h-16 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case "success":
        return "text-green-600";
      case "failure":
      case "reversed":
        return "text-red-600";
      case "processing":
        return "text-yellow-600";
      case "created":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusInfo = t.statuses[paymentStatus] || t.statuses.unknown;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">{getStatusIcon()}</div>
          <h1 className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
            {statusInfo.title}
          </h1>
          <p className="text-gray-600">{statusInfo.message}</p>
        </div>

        {paymentData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">{t.labels.orderDetails}</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">{t.labels.type}:</span>{" "}
                {paymentData.itemType === "masterclass" ? t.labels.masterclass : t.labels.product}
              </p>
              <p>
                <span className="font-medium">{t.labels.item}:</span>{" "}
                {paymentData.itemTitle}
              </p>
              <p>
                <span className="font-medium">{t.labels.name}:</span>{" "}
                {paymentData.formData.fullName}
              </p>
              <p>
                <span className="font-medium">{t.labels.email}:</span>{" "}
                {paymentData.formData.email}
              </p>
              <p>
                <span className="font-medium">{t.labels.phone}:</span>{" "}
                {paymentData.formData.whatsapp}
              </p>
              <p>
                <span className="font-medium">{t.labels.amount}:</span>{" "}
                {paymentData.price} zł
              </p>
              <p>
                <span className="font-medium">{t.labels.sessionId}:</span>{" "}
                {paymentData.sessionId}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {paymentStatus === "success" && (
            <button
              onClick={() => router.push("/")}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.buttons.home}
            </button>
          )}

          {(paymentStatus === "failure" || paymentStatus === "reversed") && (
            <div className="space-y-3">
              <button
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {t.buttons.retry}
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.buttons.home}
              </button>
            </div>
          )}

          {(paymentStatus === "processing" || paymentStatus === "created") && (
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.buttons.refresh}
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.buttons.home}
              </button>
            </div>
          )}

          {(paymentStatus === "not_found" || paymentStatus === "unknown") && (
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.buttons.home}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}