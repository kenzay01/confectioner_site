/**
 * Тестова відправка листа «Дякуємо за покупку курсу» на вказану пошту.
 * Відкрий у браузері: GET /api/test-course-email
 * Або: curl http://localhost:3000/api/test-course-email
 */
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const TEST_RECIPIENT = "roman.fedoniuk@gmail.com";

function buildCustomerCoursePurchaseEmail(params: {
  clientName: string;
  productTitle: string;
  amountInPLN: string;
}): string {
  const { clientName, productTitle, amountInPLN } = params;
  const firstName = clientName.trim().split(/\s+/)[0] || "Kliencie";
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
                    <p style="margin: 0 0 8px; font-size: 12px; color: #6b5344; text-transform: uppercase; letter-spacing: 0.05em;">Kupiony produkt</p>
                    <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #502d1c;">${productTitle}</p>
                    <p style="margin: 0; font-size: 14px; color: #555;">Kwota: <strong>${amountInPLN} PLN</strong></p>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0; font-size: 15px; color: #444; line-height: 1.6;">
                Dostęp do materiałów kursu prześlemy na ten adres e-mail w ciągu 24 godzin roboczych. W razie pytań napisz do nas – chętnie pomożemy.
              </p>
              <p style="margin: 28px 0 0; font-size: 16px; color: #1a1a1a;">
                Do zobaczenia na kursie!<br>
                <strong>Zespół Nieznany Piekarz</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background: #f9f6f3; border-top: 1px solid #e8e0d8; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #888;">
                Ten e-mail został wysłany automatycznie po dokonaniu płatności. Nie odpowiadaj na tę wiadomość.
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

export async function GET() {
  const html = buildCustomerCoursePurchaseEmail({
    clientName: "Roman Fedoniuk",
    productTitle: "Kurs: Ciasta francuskie i półfrancuskie",
    amountInPLN: "299.00",
  });

  const result = await sendEmail({
    to: TEST_RECIPIENT,
    subject: "✅ Dziękujemy za zakup! Dostęp do kursu – Nieznany Piekarz",
    html,
    text: "Dziękujemy za zakup! Kurs: Ciasta francuskie i półfrancuskie. Kwota: 299.00 PLN. Wkrótce otrzymasz dostęp do materiałów.",
  });

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Testowy list wysłany na ${TEST_RECIPIENT}`,
  });
}
