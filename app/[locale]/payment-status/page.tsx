"use client";

import { useEffect, useState, Suspense, useRef } from "react";
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
  const [isFromReturn, setIsFromReturn] = useState(false);
  
  // Використовуємо useRef для контролю запитів
  const hasCheckedStatus = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const checkPaymentStatus = async (sessionIdToCheck: string): Promise<void> => {
    try {
      console.log(`Checking payment status for session: ${sessionIdToCheck}`);
      
      const response = await fetch(`/api/payment-status?sessionId=${sessionIdToCheck}`);
      const result = await response.json();
      
      console.log('Payment status result:', result);
      
      if (result.success) {
        setPaymentStatus(result.status);
        
        // Якщо платіж успішний і ще не оброблено, обробляємо його
        if (result.status === 'success' && !processed && paymentData) {
          await handleSuccessfulPayment(paymentData);
          setProcessed(true);
          localStorage.removeItem("paymentData");
        }
        
        // Якщо статус ще processing або created і користувач повернувся з Przelewy24,
        // робимо ТІЛЬКИ ОДНУ додаткову перевірку через 5 секунд
        if ((result.status === 'processing' || result.status === 'created') && 
            isFromReturn && !retryTimeoutRef.current) {
          
          retryTimeoutRef.current = setTimeout(async () => {
            console.log('Second status check after return from Przelewy24');
            try {
              const secondResponse = await fetch(`/api/payment-status?sessionId=${sessionIdToCheck}`);
              const secondResult = await secondResponse.json();
              
              if (secondResult.success) {
                setPaymentStatus(secondResult.status);
                
                if (secondResult.status === 'success' && !processed && paymentData) {
                  await handleSuccessfulPayment(paymentData);
                  setProcessed(true);
                  localStorage.removeItem("paymentData");
                }
              }
            } catch (error) {
              console.error('Error in second status check:', error);
            }
            retryTimeoutRef.current = null;
          }, 5000);
        }
      } else {
        setError(`${t.errors.processing}: ${result.error}`);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setError(t.errors.processing);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Запобігаємо повторним викликам
    if (hasCheckedStatus.current) {
      return;
    }
    hasCheckedStatus.current = true;

    const sessionId = searchParams.get('sessionId');
    const statusParam = searchParams.get('status');
    const storedData = localStorage.getItem("paymentData");
    
    // Перевіряємо, чи користувач повернувся з Przelewy24
    setIsFromReturn(statusParam === 'return');
    
    console.log('Payment status page loaded:', { sessionId, statusParam, hasStoredData: !!storedData });

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

      const sessionIdToCheck = sessionId || parsedData.sessionId;
      if (sessionIdToCheck) {
        checkPaymentStatus(sessionIdToCheck);
      } else {
        setError(t.errors.noData);
        setLoading(false);
      }
    } else if (sessionId) {
      // Якщо немає збережених даних, але є sessionId, все одно перевіряємо статус
      checkPaymentStatus(sessionId);
    } else {
      setError(t.errors.noData);
      setLoading(false);
    }

    // Cleanup функція
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [searchParams]); // Видалили processed, t, checkAttempts з dependencies

  const handleSuccessfulPayment = async (data: PaymentData) => {
    try {
      console.log('Processing successful payment:', data.sessionId);
      
      // 1. Обробляємо успішний платіж (відправляємо в Telegram і записуємо в таблицю)
      const processResponse = await fetch('/api/process-payment', {
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

      const processResult = await processResponse.json();
      console.log('Process payment result:', processResult);

      // 2. Якщо це masterclass, зменшуємо кількість доступних місць
      if (data.itemType === 'masterclass') {
        try {
          const reduceSlotResponse = await fetch(`/api/masterclasses/${data.itemId}/reduce-slot`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const reduceSlotResult = await reduceSlotResponse.json();
          console.log('Reduce slot result:', reduceSlotResult);

          if (!reduceSlotResult.success) {
            console.error('Failed to reduce masterclass slot:', reduceSlotResult.error);
            // Не блокуємо весь процес, але логуємо помилку
          }
        } catch (error) {
          console.error('Error reducing masterclass slot:', error);
          // Не блокуємо весь процес
        }
      }

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

  // Функція для ручного оновлення статусу
  const handleRefreshStatus = async () => {
    const sessionId = searchParams.get('sessionId') || paymentData?.sessionId;
    if (!sessionId) return;

    setLoading(true);
    hasCheckedStatus.current = false; // Дозволяємо повторну перевірку
    await checkPaymentStatus(sessionId);
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isFromReturn ? 'Перевіряємо статус платежу...' : 'Завантаження...'}
          </p>
        </div>
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
          
          {isFromReturn && (paymentStatus === 'processing' || paymentStatus === 'created') && (
            <p className="text-sm text-blue-600 mt-2">
              Повернення з платіжної системи... Очікуйте результат перевірки.
            </p>
          )}
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
                onClick={handleRefreshStatus}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Перевіряємо..." : t.buttons.refresh}
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

        {/* Debug info - видаліть в продакшені */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-2 bg-gray-100 rounded text-xs">
            <p>SessionId: {searchParams.get('sessionId')}</p>
            <p>Status param: {searchParams.get('status')}</p>
            <p>Current status: {paymentStatus}</p>
            <p>Is from return: {isFromReturn.toString()}</p>
          </div>
        )}
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