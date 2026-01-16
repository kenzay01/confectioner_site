import { google, sheets_v4 } from "googleapis";
import { NextRequest } from "next/server";
import { checkRateLimit, containsDangerousPatterns, validateJsonInput, validateEmail, sanitizeString } from "@/lib/security";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: SCOPES,
});

export async function POST(req: NextRequest) {
  let requestType: string | undefined;
  
  try {
    // Перевірка наявності необхідних змінних оточення
    if (!spreadsheetId) {
      console.error("GOOGLE_SPREADSHEET_ID is not set");
      return new Response(JSON.stringify({ message: "Google Sheets configuration is missing. GOOGLE_SPREADSHEET_ID is not set." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error("Google Sheets credentials are not set");
      return new Response(JSON.stringify({ message: "Google Sheets credentials are missing. Please set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    // Зберігаємо type для використання в обробці помилок
    requestType = type;

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
    let range: string | undefined;

    if (type === "contact") {
      // Дані для аркуша "Контакти"
      const { name, email, question } = data;
      values = [[timestamp, name || "", email || "", question || ""]];
      range = "Контакти!A:D";
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
      range = "Оплати!A:J";
    } else {
      return new Response(JSON.stringify({ message: "Invalid type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Перевірка існування таблиці перед записом
    try {
      await sheets.spreadsheets.get({
        spreadsheetId,
      });
    } catch (getError: unknown) {
      if (getError && typeof getError === 'object' && 'code' in getError && getError.code === 404) {
        console.error(`Spreadsheet not found. ID: ${spreadsheetId}`);
        return new Response(
          JSON.stringify({
            message: "Google Spreadsheet not found. Please check GOOGLE_SPREADSHEET_ID and ensure the service account has access to the spreadsheet.",
            error: "Spreadsheet not found (404)",
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      throw getError;
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
  } catch (error: unknown) {
    console.error("Error adding data to Google Sheets:", error);
    
    // Більш детальна обробка помилок
    let errorMessage = "Error adding data to Google Sheets";
    let statusCode = 500;
    let errorCode: unknown = undefined;

    if (error && typeof error === 'object') {
      if ('code' in error) {
        errorCode = error.code;
        if (error.code === 404) {
          const sheetName = requestType === 'contact' ? 'Контакти' : requestType === 'payment' ? 'Оплати' : 'unknown';
          errorMessage = `Google Spreadsheet not found. Please verify:
1. GOOGLE_SPREADSHEET_ID is correct
2. The spreadsheet exists
3. The service account (${process.env.GOOGLE_CLIENT_EMAIL}) has access to the spreadsheet
4. The sheet "${sheetName}" exists in the spreadsheet`;
          statusCode = 404;
        } else if (error.code === 403) {
          errorMessage = `Access denied. Please ensure the service account (${process.env.GOOGLE_CLIENT_EMAIL}) has edit access to the spreadsheet.`;
          statusCode = 403;
        }
      }
      if ('message' in error && typeof error.message === 'string') {
        errorMessage = error.message;
      }
    }

    return new Response(
      JSON.stringify({
        message: errorMessage,
        error: error instanceof Error ? error.message : "Unknown error",
        code: errorCode,
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}