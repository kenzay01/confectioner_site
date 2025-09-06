import { google, sheets_v4 } from "googleapis";
import { NextRequest } from "next/server";

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
    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return new Response(JSON.stringify({ message: "Missing type or data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
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