// app/api/process-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { Masterclass } from "@/types/masterclass";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

const masterclassesFile = path.join(
  process.cwd(),
  "data",
  "masterclasses.json"
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, itemType, itemId, formData, amount, status, cartItems } = body;

    console.log('=== PROCESS PAYMENT ===');
    console.log('SessionId:', sessionId);
    console.log('ItemType:', itemType);
    console.log('ItemId:', itemId);
    console.log('CartItems:', Array.isArray(cartItems) ? cartItems.length : 0);
    console.log('Amount:', amount);
    console.log('Status:', status);
    console.log('FormData received:', {
      fullName: formData?.fullName,
      email: formData?.email,
      hasFullData: !!(formData?.fullName && formData?.email)
    });

    if (!sessionId || !itemType || !itemId || !formData) {
      console.error('Missing required fields:', { sessionId, itemType, itemId, hasFormData: !!formData });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Відправляємо дані в Google Sheets - вимкнено
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

    // Get order details (single masterclass or full cart)
    let masterclassDetails = '';
    try {
      const fileContents = await fs.readFile(masterclassesFile, "utf-8");
      const masterclasses = JSON.parse(fileContents) as Masterclass[];

      const orderLines: Array<{
        type?: string;
        id?: string;
        quantity?: number;
        title?: { pl?: string; en?: string };
        price?: number;
      }> =
        Array.isArray(cartItems) && cartItems.length > 0
          ? cartItems
          : itemType === "masterclass" && itemId
            ? [{ type: "masterclass", id: itemId, quantity: 1 }]
            : [];

      if (orderLines.length > 0) {
        const blocks: string[] = [];
        for (const line of orderLines) {
          if (line.type !== "masterclass" || !line.id) continue;
          const cleanItemId = String(line.id).replace("masterclass-", "");
          const masterclass = masterclasses.find(
            (m) => m.id === cleanItemId || m.id === line.id
          );
          const qty = Math.max(1, Math.floor(Number(line.quantity) || 1));
          if (!masterclass) continue;
          const formattedDate = format(new Date(masterclass.date), "d MMMM yyyy", {
            locale: pl,
          });
          const location = masterclass.location.pl || masterclass.location.en;
          const city = masterclass.city || "";
          blocks.push(`
            <div style="margin: 12px 0; padding: 12px; background: #f9f6f3; border-radius: 8px;">
              <p><strong>📖 Nazwa:</strong> ${masterclass.title.pl}</p>
              <p><strong>🔢 Ilość miejsc:</strong> ${qty}</p>
              <p><strong>📅 Data:</strong> ${formattedDate}</p>
              <p><strong>📍 Lokalizacja:</strong> ${location}</p>
              <p><strong>🏙️ Miasto:</strong> ${city || "—"}</p>
              <p><strong>💰 Cena:</strong> ${(line.price ?? masterclass.price) * qty} PLN</p>
            </div>
          `);
        }
        if (blocks.length > 0) {
          masterclassDetails = `
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <h3>📚 SZCZEGÓŁY ZAMÓWIENIA:</h3>
            ${blocks.join("")}
          `;
        }
      }
    } catch (error) {
      console.error("Error reading masterclass details:", error);
    }

    // Підготовка email повідомлення
    const isPaid = status === 'success';
    const statusEmoji = isPaid ? '✅' : '❌';
    const statusText = isPaid ? 'ОПЛАЧЕНО' : 'НЕ ОПЛАЧЕНО';
    const fromWebhook = body.fromWebhook ? ' [Webhook]' : '';
    
    const subject = `${statusEmoji} Nowe zamówienie - ${statusText}${fromWebhook}`;
    const orderTypeLabel =
      itemType === "cart" || (Array.isArray(cartItems) && cartItems.length > 1)
        ? "Koszyk (wiele warsztatów)"
        : itemType === "masterclass"
          ? "Warsztat"
          : "Produkt";
    
    let emailHtml = `
      <h2>${statusEmoji} <strong>NOWE ZAMÓWIENIE</strong> (${statusText})</h2>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p><strong>📝 Typ:</strong> ${orderTypeLabel}</p>
      <p><strong>🆔 ID:</strong> ${itemId}</p>
      ${masterclassDetails}
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <h3>👤 DANE KLIENTA:</h3>
      <p><strong>👤 Imię i nazwisko:</strong> ${formData.fullName || 'Nie podano'}</p>
      <p><strong>📧 Email:</strong> ${formData.email || 'Nie podano'}</p>
      <p><strong>📱 Telefon:</strong> ${formData.whatsapp || formData.phone || 'Nie podano'}</p>
      <p><strong>🏙️ Miasto:</strong> ${formData.city || 'Nie podano'}</p>
      <p><strong>📝 Zgoda na wizerunek:</strong> ${formData.imageConsent || 'Nie podano'}</p>
      <p><strong>💰 Suma:</strong> ${typeof amount === 'number' ? amount.toFixed(2) : amount} PLN</p>
      <p><strong>🆔 Session ID:</strong> ${sessionId}</p>
    `;
    
    if (formData.invoiceNeeded) {
      emailHtml += `
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <h3>📋 DANE DO FAKTURY:</h3>
        <p><strong>🏢 Nazwa firmy:</strong> ${formData.companyName || 'Nie podano'}</p>
        <p><strong>🔢 NIP:</strong> ${formData.nip || 'Nie podano'}</p>
        <p><strong>📍 Adres:</strong> ${formData.companyAddress || 'Nie podano'}</p>
      `;
    }

    const emailText = emailHtml.replace(/<[^>]*>/g, '').replace(/\n\s*\n/g, '\n');

    // Відправляємо email
    console.log('Sending email notification to admin...');
    console.log('Using base URL:', baseUrl);
    const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        html: emailHtml,
        text: emailText
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('❌ Failed to send email notification:', errorText);
      console.error('Email response status:', emailResponse.status);
    } else {
      const emailResult = await emailResponse.json();
      console.log('✅ Email notification sent successfully:', emailResult);
    }

    // Якщо це мастеркласс і платіж успішний, зменшуємо кількість доступних місць
    if (itemType === 'masterclass' && isPaid) {
      // Тут потрібно буде додати логіку для оновлення кількості місць в базі даних
      // Наприклад, через окремий API endpoint або безпосередньо в базі даних
      console.log(`Reducing available spots for masterclass ${itemId}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      emailSuccess: emailResponse.ok
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}