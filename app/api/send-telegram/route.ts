import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, containsDangerousPatterns, validateJsonInput } from "@/lib/security";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GROUP_ID = process.env.TELEGRAM_GROUP_ID;

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientId = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkRateLimit(clientId, 20, 60000); // 20 запитів на хвилину
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Читаємо тіло запиту
    const bodyText = await req.text();
    
    // Валідація JSON
    const jsonValidation = validateJsonInput(bodyText, 10000); // Максимум 10KB
    if (!jsonValidation.valid) {
      return NextResponse.json(
        { error: "Invalid input", details: jsonValidation.error },
        { status: 400 }
      );
    }

    const body = JSON.parse(bodyText);
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid message content" },
        { status: 400 }
      );
    }

    // Перевірка на небезпечні паттерни
    if (containsDangerousPatterns(message)) {
      return NextResponse.json(
        { error: "Dangerous patterns detected in message" },
        { status: 400 }
      );
    }

    // Обмеження довжини повідомлення
    if (message.length > 4096) {
      return NextResponse.json(
        { error: "Message too long" },
        { status: 400 }
      );
    }

    const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const response = await fetch(TELEGRAM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: GROUP_ID,
        text: message,
        parse_mode: "MarkdownV2",
      }),
    });

    const telegramResponseText = await response.text();
    // console.log("Telegram response text:", telegramResponseText);

    if (!response.ok) {
      console.error("Telegram API error:", telegramResponseText);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    const data = JSON.parse(telegramResponseText);
    // console.log("Telegram data:", data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending Telegram message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
