import { google, sheets_v4 } from "googleapis";
import { NextRequest } from "next/server";
import { checkRateLimit, containsDangerousPatterns, validateJsonInput, validateEmail, sanitizeString } from "@/lib/security";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: SCOPES,
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientId = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkRateLimit(clientId, 30, 60000); // 30 запитів на хвилину
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ message: "Too many requests. Please try again later." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Читаємо тіло запиту
    const bodyText = await req.text();
    
    // Валідація JSON
    const jsonValidation = validateJsonInput(bodyText, 50000); // Максимум 50KB
    if (!jsonValidation.valid) {
      return new Response(JSON.stringify({ message: "Invalid input", details: jsonValidation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = JSON.parse(bodyText);
    const { type, data } = body;

    if (!type || !data) {
      return new Response(JSON.stringify({ message: "Missing type or data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Валідація типу
    if (type !== "contact" && type !== "payment") {
      return new Response(JSON.stringify({ message: "Invalid type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Валідація та санітизація даних
    if (type === "contact") {
      const { name, email, question } = data;
      
      // Валідація email
      if (email && !validateEmail(email)) {
        return new Response(JSON.stringify({ message: "Invalid email format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Перевірка на небезпечні паттерни
      const fieldsToCheck = [name, email, question].filter(Boolean) as string[];
      for (const field of fieldsToCheck) {
        if (containsDangerousPatterns(field)) {
          return new Response(JSON.stringify({ message: "Dangerous patterns detected" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // Санітизація даних
      const sanitizedData = {
        name: name ? sanitizeString(name).substring(0, 200) : "",
        email: email ? sanitizeString(email).substring(0, 255) : "",
        question: question ? sanitizeString(question).substring(0, 2000) : "",
      };
      data.name = sanitizedData.name;
      data.email = sanitizedData.email;
      data.question = sanitizedData.question;
    } else if (type === "payment") {
      // Валідація платіжних даних
      const { email } = data;
      
      if (email && !validateEmail(email)) {
        return new Response(JSON.stringify({ message: "Invalid email format" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Перевірка на небезпечні паттерни
      const fieldsToCheck = Object.values(data).filter(v => typeof v === 'string') as string[];
      for (const field of fieldsToCheck) {
        if (containsDangerousPatterns(field)) {
          return new Response(JSON.stringify({ message: "Dangerous patterns detected" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }

    const authClient = await auth.getClient();
    const sheets = google.sheets({
      version: "v4",
      auth: authClient as unknown as sheets_v4.Options["auth"],
    });

    // Додаємо timestamp
    const timestamp = new Date().toLocaleString("uk-UA", {
      timeZone: "Europe/Kiev",
    });

    let values: string[][];
    let range: string;

    if (type === "contact") {
      // Дані для аркуша "Контакти"
      const { name, email, question } = data;
      values = [[timestamp, name || "", email || "", question || ""]];
      range = "Контакти!A:D"; // Оновлено до A-D, видалено колонку для Telegram
    } else if (type === "payment") {
      // Дані для аркуша "Оплати"
      const {
        fullName,
        email,
        whatsapp,
        workplace,
        profession,
        invoiceNeeded,
        companyName,
        nip,
        companyAddress,
      } = data;
      values = [
        [
          timestamp,
          fullName || "",
          email || "",
          whatsapp || "",
          workplace || "",
          profession || "",
          invoiceNeeded || "",
          companyName || "",
          nip || "",
          companyAddress || "",
        ],
      ];
      range = "Оплати!A:J"; // Без змін, оскільки Telegram тут не використовується
    } else {
      return new Response(JSON.stringify({ message: "Invalid type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Data added to sheet successfully",
        response: response.data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error adding data to Google Sheets:", error);
    return new Response(
      JSON.stringify({
        message: "Error adding data to Google Sheets",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}