import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, containsDangerousPatterns, validateJsonInput } from "@/lib/security";

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
const RECIPIENT_EMAIL = "Nieznanypiekarz@gmail.com";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const clientId = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimit = checkRateLimit(clientId, 20, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Читаємо тіло запиту
    const bodyText = await req.text();
    
    // Валідація JSON
    const jsonValidation = validateJsonInput(bodyText, 50000);
    if (!jsonValidation.valid) {
      return NextResponse.json(
        { error: "Invalid input", details: jsonValidation.error },
        { status: 400 }
      );
    }

    const body = JSON.parse(bodyText);
    const { subject, html, text } = body;

    if (!subject || typeof subject !== 'string') {
      return NextResponse.json(
        { error: "Missing or invalid subject" },
        { status: 400 }
      );
    }

    if (!html && !text) {
      return NextResponse.json(
        { error: "Missing email content (html or text required)" },
        { status: 400 }
      );
    }

    // Перевірка на небезпечні паттерни
    const contentToCheck = html || text || '';
    if (containsDangerousPatterns(contentToCheck)) {
      return NextResponse.json(
        { error: "Dangerous patterns detected in email content" },
        { status: 400 }
      );
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
      console.error("EmailJS configuration is not set");
      return NextResponse.json(
        { error: "Email service not configured. Please set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, and EMAILJS_PRIVATE_KEY in environment variables." },
        { status: 500 }
      );
    }

    // Відправка email через EmailJS API
    const emailContent = html || (text ? `<pre>${text}</pre>` : '');
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
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

    const responseData = await response.text();

    if (!response.ok) {
      console.error("EmailJS API error:", responseData);
      return NextResponse.json(
        { error: "Failed to send email", details: responseData },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
