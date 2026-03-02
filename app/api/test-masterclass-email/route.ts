import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Masterclass } from "@/types/masterclass";
import { sendEmail } from "@/lib/email";

const masterclassesFile = path.join(
  process.cwd(),
  "data",
  "masterclasses.json"
);

const TEST_RECIPIENT =
  process.env.TEST_MASTERCLASS_EMAIL || "roman.fedoniuk@gmail.com";

function buildCustomerMasterclassEmail(params: {
  clientName: string;
  workshopTitle: string;
  amountInPLN: string;
  formattedDate: string;
  location: string;
  city: string;
  startTime?: string;
  endTime?: string;
}): string {
  const { clientName, workshopTitle, formattedDate, location, city, startTime, endTime } =
    params;
  const firstName = clientName.trim().split(/\s+/)[0] || "Kliencie";
  const dateLine = formattedDate
    ? `Data: <strong>${formattedDate}</strong>`
    : "";
  const placeLine =
    location || city
      ? `Miejsce: <strong>${[location, city].filter(Boolean).join(", ")}</strong>`
      : "";
  const timeLine =
    startTime || endTime
      ? `Godziny: <strong>${[startTime, endTime].filter(Boolean).join(" – ")}</strong>`
      : "";

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dziękujemy za zapis na szkolenie</title>
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
            <td style="padding: 24px 40px 32px;">
              <p style="margin: 0 0 16px; font-size: 18px; color: #1a1a1a; line-height: 1.5;">
                Cześć <strong>${firstName}</strong>,
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; color: #333; line-height: 1.6;">
                Dziękujemy za zapis na szkolenie.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background: #fdf5ec; border-radius: 12px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-size: 15px; color: #4a321f; line-height: 1.6;">
                      <strong>Twoje zgłoszenie zostało pomyślnie przyjęte — miejsce на szkoleniu jest już dla Ciebie zarezerwowane.</strong>
                    </p>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 24px; background: #f9f6f3; border-radius: 12px; border: 1px solid #e8e0d8;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #6b5344; text-transform: uppercase; letter-spacing: 0.08em;">Szczegóły szkolenia</p>
                    <p style="margin: 0 0 4px; font-size: 15px; color: #1a1a1a;">Szkolenie: <strong>${workshopTitle}</strong></p>
                    ${dateLine ? `<p style="margin: 0 0 4px; font-size: 15px; color: #1a1a1a;">${dateLine}</p>` : ""}
                    ${timeLine ? `<p style="margin: 0 0 4px; font-size: 15px; color: #1a1a1a;">${timeLine}</p>` : ""}
                    ${placeLine ? `<p style="margin: 0; font-size: 15px; color: #1a1a1a;">${placeLine}</p>` : ""}
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 12px; font-size: 15px; color: #444; line-height: 1.7;">
                W najbliższym czasie prześlę Ci wszystkie niezbędne informacje organizacyjne, w tym:
              </p>
              <ul style="margin: 0 0 20px 20px; padding: 0; font-size: 15px; color: #444; line-height: 1.7;">
                <li style="margin-bottom: 6px;">szczegółowy harmonogram szkolenia,</li>
                <li style="margin-bottom: 6px;">informacje dotyczące lokalizacji,</li>
                <li style="margin-bottom: 0;">wskazówki przygotowawcze (jeśli będą wymagane).</li>
              </ul>
              <p style="margin: 0 0 16px; font-size: 15px; color: #444; line-height: 1.7;">
                Na około <strong>7 dni przed rozpoczęciem szkolenia</strong> otrzymasz dodatkowe przypomnienie wraz z kompletem najważniejszych informacji.
              </p>
              <p style="margin: 0 0 16px; font-size: 15px; color: #444; line-height: 1.7;">
                <strong>Masz pytania?</strong><br />
                W razie pytań organizacyjnych lub potrzeby wystawienia faktury możesz odpowiedzieć bezpośrednio на tę wiadomość — pozostaję do Twojej dyspozycji.
              </p>
              <p style="margin: 24px 0 0; font-size: 16px; color: #1a1a1a; line-height: 1.6;">
                Do zobaczenia на szkoleniu!<br />
                <br />
                <strong>Yaroslav Semkiv</strong><br />
                Nieznany Piekarz
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

export async function GET() {
  try {
    const raw = await fs.readFile(masterclassesFile, "utf-8");
    const masterclasses = JSON.parse(raw) as Masterclass[];

    if (!masterclasses.length) {
      return NextResponse.json(
        { success: false, error: "Brak masterclassów w bazie (masterclasses.json)." },
        { status: 500 }
      );
    }

    // Bierzemy pierwszy masterclass z listy jako testowy
    const masterclass = masterclasses[0];

    const locale = pl;
    const dateStart = format(new Date(masterclass.date), "d MMMM yyyy", {
      locale,
    });
    const formattedDate =
      masterclass.dateType === "range" && masterclass.dateEnd
        ? `${dateStart} – ${format(
            new Date(masterclass.dateEnd),
            "d MMMM yyyy",
            { locale }
          )}`
        : dateStart;

    const location = masterclass.location?.pl || masterclass.location?.en || "";
    const city = masterclass.city || "";

    const html = buildCustomerMasterclassEmail({
      clientName: "Roman Fedoniuk",
      workshopTitle:
        masterclass.title.pl || masterclass.title.en || "Warsztat",
      amountInPLN: masterclass.price.toFixed(2),
      formattedDate,
      location,
      city,
      startTime: masterclass.startTime || undefined,
      endTime: masterclass.endTime || undefined,
    });

    const result = await sendEmail({
      to: TEST_RECIPIENT,
      subject: "✅ Dziękujemy za zapis na szkolenie – Nieznany Piekarz",
      html,
      text: `Dziękujemy za zakup! Warsztat: ${
        masterclass.title.pl
      }. Data: ${formattedDate}. Miejsce: ${[location, city]
        .filter(Boolean)
        .join(", ")}. Suma: ${masterclass.price.toFixed(2)} PLN.`,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Testowy list warsztatowy wysłany na ${TEST_RECIPIENT}`,
    });
  } catch (error) {
    console.error("Error in test-masterclass-email:", error);
    return NextResponse.json(
      { success: false, error: "Błąd podczas wysyłki testowego maila." },
      { status: 500 }
    );
  }
}

