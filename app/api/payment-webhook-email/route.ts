// app/api/payment-webhook-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { Masterclass } from "@/types/masterclass";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { sendEmail } from "@/lib/email";

interface WebhookBody {
  merchantId?: number | string;
  posId?: number | string;
  sessionId?: string;
  amount?: number | string;
  originAmount?: number | string;
  currency?: string;
  orderId?: number | string;
  methodId?: number | string;
  statement?: string;
  sign?: string;
  [key: string]: unknown;
}

const masterclassesFile = path.join(
  process.cwd(),
  "data",
  "masterclasses.json"
);
const paymentSessionsFile = path.join(
  process.cwd(),
  "data",
  "payment-sessions.json"
);

// Обробка OPTIONS запиту (CORS preflight)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Парсимо тіло вебхука
    let body: WebhookBody;
    const contentType = req.headers.get("content-type");

    console.log("=== PAYMENT WEBHOOK EMAIL ===");
    console.log("Content-Type:", contentType);

    if (contentType?.includes("application/json")) {
      body = (await req.json()) as WebhookBody;
    } else {
      const formData = await req.formData();
      const formEntries: WebhookBody = {};
      for (const [key, value] of formData.entries()) {
        formEntries[key] = value;
      }
      body = formEntries;
      if (body.amount) body.amount = parseInt(String(body.amount));
      if (body.originAmount)
        body.originAmount = parseInt(String(body.originAmount));
      if (body.orderId) body.orderId = parseInt(String(body.orderId));
      if (body.methodId) body.methodId = parseInt(String(body.methodId));
      if (body.merchantId) body.merchantId = parseInt(String(body.merchantId));
      if (body.posId) body.posId = parseInt(String(body.posId));
    }

    console.log("Webhook body:", JSON.stringify(body, null, 2));

    const {
      merchantId,
      posId,
      sessionId,
      amount,
      originAmount,
      currency,
      orderId,
      methodId,
      statement,
      sign,
    } = body;

    // Верифікація підпису
    const crcKey = process.env.PRZELEWY24_CRC_KEY;
    if (!crcKey) {
      console.error("Missing CRC key configuration");
      return new Response("OK", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const signObject = {
      merchantId:
        typeof merchantId === "string" ? parseInt(merchantId) : merchantId,
      posId: typeof posId === "string" ? parseInt(String(posId)) : posId,
      sessionId: sessionId,
      amount: typeof amount === "string" ? parseInt(amount) : amount,
      originAmount:
        typeof originAmount === "string"
          ? parseInt(String(originAmount))
          : originAmount,
      currency: currency || "PLN",
      orderId: typeof orderId === "string" ? parseInt(String(orderId)) : orderId,
      methodId:
        typeof methodId === "string" ? parseInt(String(methodId)) : methodId,
      statement: statement || "",
      crc: crcKey,
    };

    const signString = JSON.stringify(signObject);
    const calculatedSign = crypto
      .createHash("sha384")
      .update(signString, "utf8")
      .digest("hex");

    console.log("=== SIGNATURE VERIFICATION ===");
    console.log("Received sign:", sign);
    console.log("Calculated sign:", calculatedSign);
    console.log("Match:", calculatedSign === sign);

    const skipVerification = process.env.SKIP_WEBHOOK_VERIFICATION === "true";

    if (!skipVerification && calculatedSign !== sign) {
      console.error("❌ Invalid signature in webhook!");
      return new Response("OK", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    console.log("✅ Signature verified successfully!");

    // Верифікація транзакції через API Przelewy24
    console.log("=== VERIFYING TRANSACTION ===");
    let isVerified = false;
    if (sessionId && amount !== undefined && orderId !== undefined) {
      const amountNum = typeof amount === "string" ? parseInt(amount) : amount;
      const orderIdNum =
        typeof orderId === "string" ? parseInt(String(orderId)) : orderId;
      isVerified = await verifyTransaction(sessionId, amountNum, orderIdNum);
    } else {
      console.warn("Missing required fields for verification:", {
        sessionId,
        amount,
        orderId,
      });
    }

    console.log("Transaction verified:", isVerified);

    // Якщо транзакція верифікована - відправляємо email
    if (isVerified && sessionId) {
      try {
        // Витягуємо itemType та itemId з sessionId
        const sessionParts = sessionId.split("_");
        let itemType = "product";
        let itemId = "";

        if (sessionParts.length >= 2) {
          if (sessionParts[0] === "masterclass") {
            itemType = "masterclass";
            itemId = sessionParts[1]; // "masterclass-123"
          } else if (sessionParts[0] === "product") {
            itemType = "product";
            itemId = sessionParts[1];
          }
        }

        console.log("Processing payment:", { itemType, itemId, sessionId });

        // Отримуємо дані клієнта з Przelewy24
        const merchantIdEnv = process.env.PRZELEWY24_MERCHANT_ID;
        const posIdEnv = process.env.PRZELEWY24_POS_ID;
        const apiKey = process.env.PRZELEWY24_API_KEY;

        let clientEmail = "";
        let clientName = "";
        let clientPhone = "";

        if (merchantIdEnv && posIdEnv && apiKey) {
          try {
            const baseUrl = "https://secure.przelewy24.pl/api/v1";
            const authString = `${posIdEnv}:${apiKey}`;
            const encodedAuth = Buffer.from(authString).toString("base64");

            const transactionResponse = await fetch(
              `${baseUrl}/transaction/by/sessionId/${sessionId}`,
              {
                method: "GET",
                headers: {
                  Authorization: `Basic ${encodedAuth}`,
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              }
            );

            if (transactionResponse.ok) {
              const transactionResult = await transactionResponse.json();
              if (transactionResult.data) {
                const transaction = Array.isArray(transactionResult.data)
                  ? transactionResult.data[0]
                  : transactionResult.data;
                clientEmail = transaction.clientEmail || "";
                clientName = transaction.clientName || "";
                clientPhone = transaction.phone || "";
              }
            }
          } catch (error) {
            console.error("Error fetching transaction details:", error);
          }
        }

        // Готуємо деталі про товар/майстер-клас
        let itemDetails = "";
        if (itemType === "masterclass" && itemId) {
          try {
            const fileContents = await fs.readFile(masterclassesFile, "utf-8");
            const masterclasses = JSON.parse(fileContents) as Masterclass[];

            const cleanItemId = itemId.replace("masterclass-", "");
            const masterclass = masterclasses.find(
              (m) => m.id === cleanItemId || m.id === itemId
            );

            if (masterclass) {
              const formattedDate = format(
                new Date(masterclass.date),
                "d MMMM yyyy",
                { locale: pl }
              );
              const location = masterclass.location.pl || masterclass.location.en;
              const city = masterclass.city || "";
              itemDetails = `
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <h3>📚 SZCZEGÓŁY WARSZTATU:</h3>
                <p><strong>📖 Nazwa:</strong> ${masterclass.title.pl}</p>
                <p><strong>📅 Data:</strong> ${formattedDate}</p>
                <p><strong>📍 Lokalizacja:</strong> ${location}</p>
                <p><strong>🏙️ Miasto:</strong> ${city}</p>
                <p><strong>💰 Cena:</strong> ${masterclass.price} PLN</p>
              `;
            }
          } catch (error) {
            console.error("Error reading masterclass details:", error);
          }
        }

        // Формуємо email
        const amountInPLN =
          typeof amount === "number"
            ? (amount / 100).toFixed(2)
            : String(amount);
        const subject = `✅ Nowe zamówienie - OPŁACONE [Webhook]`;

        // Дані форми (згода на wizerunek, faktura, kontakt) — збережені при створенні платежу
        let sessionForm: Record<string, string | boolean> = {};
        try {
          const raw = await fs.readFile(paymentSessionsFile, "utf-8");
          const sessions = JSON.parse(raw) as Record<string, Record<string, unknown>>;
          if (sessionId && sessions[sessionId]) {
            const s = sessions[sessionId];
            sessionForm = {
              imageConsent: String(s.imageConsent ?? ""),
              invoiceNeeded: !!(s.invoiceNeeded ?? false),
              companyName: String(s.companyName ?? ""),
              nip: String(s.nip ?? ""),
              companyAddress: String(s.companyAddress ?? ""),
              city: String(s.city ?? ""),
              fullName: String(s.fullName ?? ""),
              email: String(s.email ?? ""),
              phone: String(s.phone ?? ""),
            } as Record<string, string | boolean>;
            delete sessions[sessionId];
            await fs.writeFile(paymentSessionsFile, JSON.stringify(sessions, null, 2), "utf-8");
          }
        } catch {
          // файл не існує або помилка читання
        }

        const imageConsentText =
          sessionForm.imageConsent === "agree"
            ? "Wyrażam zgodę na ud. wizerunku"
            : sessionForm.imageConsent === "disagree"
              ? "Nie wyrażam zgody na ud. wizerunku"
              : "Nie podano";
        const cityDisplay =
          (sessionForm.city as string | undefined) && sessionForm.city !== ""
            ? (sessionForm.city as string)
            : "Nie podano";
        const phoneDisplay =
          ((sessionForm.phone as string | undefined) &&
            (sessionForm.phone as string) !== "") ||
          clientPhone
            ? ((sessionForm.phone as string) ||
                (clientPhone as string) ||
                "Nie podano")
            : "Nie podano";
        const fullNameDisplay =
          ((sessionForm.fullName as string | undefined) &&
            (sessionForm.fullName as string) !== "") ||
          clientName
            ? ((sessionForm.fullName as string) ||
                (clientName as string) ||
                "Nie podano")
            : "Nie podano";
        const emailDisplay =
          ((sessionForm.email as string | undefined) &&
            (sessionForm.email as string) !== "") ||
          clientEmail
            ? ((sessionForm.email as string) ||
                (clientEmail as string) ||
                "Nie podano")
            : "Nie podano";
        const invoiceBlock =
          sessionForm.invoiceNeeded === true
            ? `
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <h3>📋 DANE DO FAKTURY:</h3>
          <p><strong>Chcę otrzymać fakturę VAT:</strong> Tak</p>
          <p><strong>🏢 Nazwa firmy:</strong> ${String(sessionForm.companyName) || "Nie podano"}</p>
          <p><strong>🔢 NIP:</strong> ${String(sessionForm.nip) || "Nie podano"}</p>
          <p><strong>📍 Adres:</strong> ${String(sessionForm.companyAddress) || "Nie podano"}</p>`
            : `
          <p><strong>Chcę otrzymać fakturę VAT:</strong> Nie</p>`;

        const emailHtml = `
          <h2>✅ <strong>NOWE ZAMÓWIENIE</strong> (OPŁACONE)</h2>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p><strong>📝 Typ:</strong> ${itemType === "masterclass" ? "Warsztat" : "Produkt"}</p>
          <p><strong>🆔 ID:</strong> ${itemId}</p>
          ${itemDetails}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <h3>👤 DANE KLIENTA:</h3>
          <p><strong>👤 Imię i nazwisko:</strong> ${fullNameDisplay}</p>
          <p><strong>📧 Email:</strong> ${emailDisplay}</p>
          <p><strong>📱 Telefon:</strong> ${phoneDisplay}</p>
          <p><strong>🏙️ Miasto (lub kod pocztowy):</strong> ${cityDisplay}</p>
          <p><strong>Udostępnienie wizerunku:</strong> ${imageConsentText}</p>
          ${invoiceBlock}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p><strong>💰 Suma:</strong> ${amountInPLN} PLN</p>
          <p><strong>🆔 Session ID:</strong> ${sessionId}</p>
          <p><strong>🆔 Order ID:</strong> ${orderId}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p><em>⚡ Email wysłany automatycznie z webhook Przelewy24</em></p>
        `;

        const emailText = emailHtml
          .replace(/<[^>]*>/g, "")
          .replace(/\n\s*\n/g, "\n");

        // Відправляємо email через EmailJS напряму
        console.log("Sending email notification to admin...");
        
        const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
        const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
        const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
        const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
        const RECIPIENT_EMAIL = "Nieznanypiekarz@gmail.com";

        if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && EMAILJS_PRIVATE_KEY) {
          try {
            const emailContent = emailHtml;
            const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                service_id: EMAILJS_SERVICE_ID,
                template_id: EMAILJS_TEMPLATE_ID,
                user_id: EMAILJS_PUBLIC_KEY,
                accessToken: EMAILJS_PRIVATE_KEY,
                template_params: {
                  to_email: RECIPIENT_EMAIL,
                  subject: subject,
                  message: emailContent,
                  reply_to: RECIPIENT_EMAIL,
                },
              }),
            });

            const responseData = await emailResponse.text();

            if (!emailResponse.ok) {
              console.error("❌ EmailJS API error:", responseData);
            } else {
              console.log("✅ Email notification sent successfully");
            }
          } catch (emailError) {
            console.error("❌ Error sending email:", emailError);
          }
        } else {
          console.error("❌ EmailJS configuration is not set");
        }

        // Після успішної покупки майстер-класу (warsztat) — відправляємо клієнту лист з датою та місцем
        if (itemType === "masterclass" && clientEmail && itemId) {
          try {
            const fileContents = await fs.readFile(masterclassesFile, "utf-8");
            const masterclasses = JSON.parse(fileContents) as Masterclass[];
            const masterclassId = itemId.replace("masterclass-", "");
            const masterclass = masterclasses.find(
              (m) => m.id === masterclassId || m.id === itemId
            );
            if (masterclass) {
              const locale = pl;
              const dateStart = format(new Date(masterclass.date), "d MMMM yyyy", { locale });
              const formattedDate =
                masterclass.dateType === "range" && masterclass.dateEnd
                  ? `${dateStart} – ${format(new Date(masterclass.dateEnd), "d MMMM yyyy", { locale })}`
                  : dateStart;
              const location = masterclass.location?.pl || masterclass.location?.en || "";
              const city = masterclass.city || "";
              const customerHtml = buildCustomerCoursePurchaseEmail({
                clientName: clientName || "Kliencie",
                productTitle: masterclass.title.pl || masterclass.title.en || "Warsztat",
                amountInPLN:
                  typeof amount === "number"
                    ? (amount / 100).toFixed(2)
                    : String(amount),
                isWorkshop: true,
                eventDetails: {
                  formattedDate,
                  location,
                  city,
                  startTime: masterclass.startTime || undefined,
                  endTime: masterclass.endTime || undefined,
                },
              });
              const customerResult = await sendEmail({
                to: clientEmail,
                subject: "✅ Dziękujemy za zakup! Warsztat – Nieznany Piekarz",
                html: customerHtml,
                text: `Dziękujemy za zakup! Warsztat: ${masterclass.title.pl}. Data: ${formattedDate}. Miejsce: ${[location, city].filter(Boolean).join(", ")}. Suma: ${typeof amount === "number" ? (amount / 100).toFixed(2) : amount} PLN.`,
              });
              if (customerResult.success) {
                console.log("✅ Customer masterclass confirmation email sent to:", clientEmail);
              } else {
                console.error("❌ Failed to send customer masterclass email:", customerResult.error);
              }
            }
          } catch (e) {
            console.error("Error sending masterclass customer email:", e);
          }
        }

        // Якщо це майстер-клас, зменшуємо кількість місць
        if (itemType === "masterclass" && itemId) {
          const masterclassId = itemId.replace("masterclass-", "");
          try {
            // Читаємо файл з майстер-класами
            const fileContents = await fs.readFile(masterclassesFile, "utf-8");
            const masterclasses = JSON.parse(fileContents) as Masterclass[];
            
            // Знаходимо потрібний майстер-клас
            const masterclassIndex = masterclasses.findIndex(
              (m) => m.id === masterclassId
            );
            
            if (masterclassIndex !== -1) {
              const masterclass = masterclasses[masterclassIndex];
              
              // Зменшуємо кількість місць
              if (masterclass.availableSlots > 0) {
                masterclasses[masterclassIndex] = {
                  ...masterclass,
                  availableSlots: masterclass.availableSlots - 1,
                };
                
                // Зберігаємо оновлений файл
                await fs.writeFile(
                  masterclassesFile,
                  JSON.stringify(masterclasses, null, 2)
                );
                
                console.log("✅ Slot reduced successfully for masterclass:", masterclassId);
              } else {
                console.warn("⚠️ No available slots to reduce for masterclass:", masterclassId);
              }
            } else {
              console.error("❌ Masterclass not found:", masterclassId);
            }
          } catch (error) {
            console.error("Error reducing masterclass slot:", error);
          }
        }
      } catch (error) {
        console.error("Error processing payment in webhook:", error);
      }
    }

    // Завжди повертаємо 200 OK для Przelewy24
    console.log(
      `=== WEBHOOK PROCESSED: session=${sessionId}, order=${orderId} ===`
    );

    return new Response("OK", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("=== ERROR PROCESSING WEBHOOK ===");
    console.error("Error:", error);
    return new Response("OK", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}

function buildCustomerCoursePurchaseEmail(params: {
  clientName: string;
  productTitle: string;
  amountInPLN: string;
  eventDetails?: {
    formattedDate: string;
    location: string;
    city: string;
    startTime?: string;
    endTime?: string;
  };
  isWorkshop?: boolean;
}): string {
  const { clientName, productTitle, amountInPLN, eventDetails, isWorkshop } = params;
  const firstName = clientName.trim().split(/\s+/)[0] || "Kliencie";
  const purchaseLabel = isWorkshop ? "Zakupiony warsztat" : "Kupiony produkt";
  const whenWhereBlock = eventDetails
    ? `
              <p style="margin: 24px 0 0; font-size: 15px; color: #444; line-height: 1.6;">
                <strong>Kiedy i gdzie odbywa się warsztat?</strong><br>
                📅 <strong>Data:</strong> ${eventDetails.formattedDate}${eventDetails.startTime || eventDetails.endTime ? `<br>🕐 <strong>Godziny:</strong> ${[eventDetails.startTime, eventDetails.endTime].filter(Boolean).join(" – ")}` : ""}<br>
                📍 <strong>Miejsce:</strong> ${[eventDetails.location, eventDetails.city].filter(Boolean).join(", ")}
              </p>`
    : `
              <p style="margin: 24px 0 0; font-size: 15px; color: #444; line-height: 1.6;">
                <strong>Kiedy i gdzie odbywa się kurs?</strong><br>
                Jest to kurs online dostępny w formie nagrań wideo oraz materiałów do pobrania. Możesz przerabiać go w dowolnym miejscu i czasie – wystarczy dostęp do internetu.
              </p>`;
  const followUpText = isWorkshop
    ? "W razie pytań napisz do nas – chętnie pomożemy."
    : "Dostęp do materiałów kursu prześlemy na ten adres e-mail w ciągu 24 godzin roboczych. W razie pytań napisz do nas – chętnie pomożemy.";
  const closing = isWorkshop ? "Do zobaczenia na warsztacie!" : "Do zobaczenia na kursie!";
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dziękujemy za zakup</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background-color: #f5f0eb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f0eb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(80, 45, 28, 0.12);">
          <tr>
            <td style="background: #ffffff; padding: 32px 40px; text-align: center;">
              <img src="https://nieznanypiekarz.com/materials/logo-final.png" alt="Nieznany Piekarz" width="120" height="120" style="display: block; margin: 0 auto 16px; max-width: 120px; height: auto;" />
              <h1 style="margin: 0; color: #502d1c; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">
                Nieznany Piekarz
              </h1>
              <p style="margin: 8px 0 0; color: #6b5344; font-size: 14px;">Szkolenia z nowoczesnego piekarnictwa</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 40px 32px;">
              <p style="margin: 0 0 20px; font-size: 18px; color: #1a1a1a; line-height: 1.5;">
                Cześć <strong>${firstName}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #333; line-height: 1.6;">
                Dziękujemy za zakup! Płatność została pomyślnie zrealizowana.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f9f6f3; border-radius: 12px; border: 1px solid #e8e0d8;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 8px; font-size: 12px; color: #6b5344; text-transform: uppercase; letter-spacing: 0.05em;">${purchaseLabel}</p>
                    <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #502d1c;">${productTitle}</p>
                    <p style="margin: 0; font-size: 14px; color: #555;">Kwota: <strong>${amountInPLN} PLN</strong></p>
                  </td>
                </tr>
              </table>
              ${whenWhereBlock}
              <p style="margin: 16px 0 0; font-size: 15px; color: #444; line-height: 1.6;">
                ${followUpText}
              </p>
              <p style="margin: 28px 0 0; font-size: 16px; color: #1a1a1a;">
                ${closing}<br>
                <strong>Zespół Nieznany Piekarz</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background: #f9f6f3; border-top: 1px solid #e8e0d8; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #888;">
                Ten e-mail został wysłany automatycznie po dokonaniu płatności. Nie odpowiadaj na tę wiadomość.
              </p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #888;">
                Strona: <a href="https://nieznanypiekarz.com" style="color: #6b5344; text-decoration: none;">nieznanypiekarz.com</a><br>
                Instagram: <a href="https://www.instagram.com/nieznanypiekarz" style="color: #6b5344; text-decoration: none;">📸 @nieznanypiekarz</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

async function verifyTransaction(
  sessionId: string,
  amount: number,
  orderId: number
) {
  try {
    const merchantId = process.env.PRZELEWY24_MERCHANT_ID;
    const posId = process.env.PRZELEWY24_POS_ID;
    const apiKey = process.env.PRZELEWY24_API_KEY;
    const crcKey = process.env.PRZELEWY24_CRC_KEY;

    if (!merchantId || !posId || !apiKey || !crcKey) {
      console.error("Missing credentials for verification");
      return false;
    }

    const baseUrl = "https://secure.przelewy24.pl/api/v1";

    const signObject = {
      sessionId: sessionId,
      orderId: orderId,
      amount: amount,
      currency: "PLN",
      crc: crcKey,
    };

    const signString = JSON.stringify(signObject);
    const sign = crypto
      .createHash("sha384")
      .update(signString, "utf8")
      .digest("hex");

    const verifyData = {
      merchantId: parseInt(merchantId),
      posId: parseInt(posId),
      sessionId: sessionId,
      amount: amount,
      currency: "PLN",
      orderId: orderId,
      sign: sign,
    };

    console.log("=== VERIFY REQUEST ===");
    console.log("Sign object:", signObject);
    console.log("Sign (SHA-384):", sign);

    const authString = `${posId}:${apiKey}`;
    const encodedAuth = Buffer.from(authString).toString("base64");

    const response = await fetch(`${baseUrl}/transaction/verify`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedAuth}`,
        Accept: "application/json",
      },
      body: JSON.stringify(verifyData),
    });

    const responseText = await response.text();
    console.log("=== VERIFY RESPONSE ===");
    console.log("Status:", response.status);
    console.log("Body:", responseText);

    if (!response.ok) {
      console.error("Verify failed:", responseText);
      return false;
    }

    const result = responseText ? JSON.parse(responseText) : {};
    const isSuccess =
      (result.data?.status === "success" ||
        result.data?.status === "SUCCESS") &&
      result.responseCode === 0;

    console.log("Is verified:", isSuccess);
    return response.ok && isSuccess;
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return false;
  }
}
