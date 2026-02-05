// app/api/payment-webhook-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { Masterclass } from "@/types/masterclass";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

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

        const emailHtml = `
          <h2>✅ <strong>NOWE ZAMÓWIENIE</strong> (OPŁACONE)</h2>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p><strong>📝 Typ:</strong> ${itemType === "masterclass" ? "Warsztat" : "Produkt"}</p>
          <p><strong>🆔 ID:</strong> ${itemId}</p>
          ${itemDetails}
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <h3>👤 DANE KLIENTA:</h3>
          <p><strong>👤 Imię i nazwisko:</strong> ${clientName || "Nie podano"}</p>
          <p><strong>📧 Email:</strong> ${clientEmail || "Nie podano"}</p>
          <p><strong>📱 Telefon:</strong> ${clientPhone || "Nie podano"}</p>
          <p><strong>💰 Suma:</strong> ${amountInPLN} PLN</p>
          <p><strong>🆔 Session ID:</strong> ${sessionId}</p>
          <p><strong>🆔 Order ID:</strong> ${orderId}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p><em>⚡ Email wysłany automatycznie z webhook Przelewy24</em></p>
        `;

        const emailText = emailHtml
          .replace(/<[^>]*>/g, "")
          .replace(/\n\s*\n/g, "\n");

        // Відправляємо email
        console.log("Sending email notification to admin...");
        const baseUrl =
          process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
        const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject,
            html: emailHtml,
            text: emailText,
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error("❌ Failed to send email notification:", errorText);
        } else {
          const emailResult = await emailResponse.json();
          console.log("✅ Email notification sent successfully:", emailResult);
        }

        // Якщо це майстер-клас, зменшуємо кількість місць
        if (itemType === "masterclass" && itemId) {
          const masterclassId = itemId.replace("masterclass-", "");
          try {
            const reduceSlotResponse = await fetch(
              `${baseUrl}/api/masterclasses/${masterclassId}/reduce-slot`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (reduceSlotResponse.ok) {
              const reduceSlotResult = await reduceSlotResponse.json();
              console.log("✅ Slot reduced successfully:", reduceSlotResult);
            } else {
              console.error(
                "❌ Failed to reduce slot:",
                await reduceSlotResponse.text()
              );
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
