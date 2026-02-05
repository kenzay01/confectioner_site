"use client";

import { useEffect, useState } from "react";
import { useCurrentLanguage } from "@/hooks/getCurrentLanguage";

type Status = "idle" | "sending" | "success" | "error";

export default function TestEmailPage() {
  const currentLocale = useCurrentLanguage() as "pl" | "en";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const sendTestEmail = async () => {
    try {
      setStatus("sending");
      setError(null);

      const subject = "✅ TEST: Nowe zamówienie - OПŁACONE [Test]";

      const emailHtml = `
        <h2>✅ <strong>NOWE ZAMÓWIENIE (TEST)</strong> (OПŁACONE)</h2>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p><strong>📝 Typ:</strong> Warsztat (TEST)</p>
        <p><strong>🆔 ID:</strong> test-masterclass-123</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <h3>👤 DANE KLIENTA (TEST):</h3>
        <p><strong>👤 Imię i nazwisko:</strong> Jan Kowalski (TEST)</p>
        <p><strong>📧 Email:</strong> test@example.com</p>
        <p><strong>📱 Telefon:</strong> +48 600 000 000</p>
        <p><strong>🏙️ Miasto:</strong> Warszawa</p>
        <p><strong>📝 Zgoda na wizerunek:</strong> Tak</p>
        <p><strong>💰 Suma:</strong> 199.00 PLN</p>
        <p><strong>🆔 Session ID:</strong> test_session_123</p>
      `;

      const emailText = emailHtml
        .replace(/<[^>]*>/g, "")
        .replace(/\n\s*\n/g, "\n")
        .trim();

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          html: emailHtml,
          text: emailText,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.details || data?.error || "Failed to send test email"
        );
      }

      setStatus("success");
    } catch (err) {
      console.error("Error sending test email:", err);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    if (status === "idle") {
      void sendTestEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // запускаємо лише один раз при маунті

  const getStatusMessage = () => {
    const isPl = currentLocale === "pl";

    if (status === "sending") {
      return isPl
        ? "Wysyłanie testowego emaila o płatności..."
        : "Sending test payment email...";
    }

    if (status === "success") {
      return isPl
        ? "Testowy email o płatności został wysłany na skrzynkę administracyjną."
        : "Test payment email has been sent to the admin inbox.";
    }

    if (status === "error") {
      return isPl
        ? "Błąd podczas wysyłania testowego emaila o płatności."
        : "Error while sending test payment email.";
    }

    return isPl
      ? "Kliknij przycisk poniżej, aby wysłać testowy email o płatności."
      : "Click the button below to send a test payment email.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2">
          {currentLocale === "pl"
            ? "Test wysyłki emaila o płatności"
            : "Test payment email sender"}
        </h1>

        <p className="text-sm text-gray-600 text-center mb-4">
          {getStatusMessage()}
        </p>

        {error && (
          <p className="text-sm text-red-600 text-center break-words">
            {error}
          </p>
        )}

        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={sendTestEmail}
            disabled={status === "sending"}
            className={`btn-unified px-6 py-3 ${
              status === "sending" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {status === "sending"
              ? currentLocale === "pl"
                ? "Wysyłanie..."
                : "Sending..."
              : currentLocale === "pl"
              ? "Wyślij testowy email"
              : "Send test email"}
          </button>
        </div>
      </div>
    </div>
  );
}

