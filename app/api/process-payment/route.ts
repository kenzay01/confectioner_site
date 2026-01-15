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
    const { sessionId, itemType, itemId, formData, amount, status } = body;

    console.log('=== PROCESS PAYMENT ===');
    console.log('SessionId:', sessionId);
    console.log('ItemType:', itemType);
    console.log('ItemId:', itemId);
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

    // Відправляємо дані в Google Sheets
    const sheetsResponse = await fetch(`${req.nextUrl.origin}/api/google-sheets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: 'payment',
        data: {
          ...formData,
          itemType,
          itemId,
          amount,
          sessionId,
          paymentStatus: status,
        }
      })
    });

    if (!sheetsResponse.ok) {
      console.error('Failed to add data to Google Sheets');
    }

    // Get masterclass details if it's a masterclass payment
    let masterclassDetails = '';
    if (itemType === 'masterclass' && itemId) {
      try {
        const fileContents = await fs.readFile(masterclassesFile, "utf-8");
        const masterclasses = JSON.parse(fileContents) as Masterclass[];
        const masterclass = masterclasses.find(m => m.id === itemId);
        
        if (masterclass) {
          const formattedDate = format(new Date(masterclass.date), "d MMMM yyyy", { locale: pl });
          const location = masterclass.location.pl || masterclass.location.en;
          const city = masterclass.city || '';
          masterclassDetails = `
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
        console.error('Error reading masterclass details:', error);
      }
    }

    // Підготовка email повідомлення
    const isPaid = status === 'success';
    const statusEmoji = isPaid ? '✅' : '❌';
    const statusText = isPaid ? 'ОПЛАЧЕНО' : 'НЕ ОПЛАЧЕНО';
    
    const subject = `${statusEmoji} Nowe zamówienie - ${statusText}`;
    
    let emailHtml = `
      <h2>${statusEmoji} <strong>NOWE ZAMÓWIENIE</strong> (${statusText})</h2>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <p><strong>📝 Typ:</strong> ${itemType === 'masterclass' ? 'Warsztat' : 'Produkt'}</p>
      <p><strong>🆔 ID:</strong> ${itemId}</p>
      ${masterclassDetails}
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
      <h3>👤 DANE KLIENTA:</h3>
      <p><strong>👤 Imię i nazwisko:</strong> ${formData.fullName || 'Nie podano'}</p>
      <p><strong>📧 Email:</strong> ${formData.email || 'Nie podano'}</p>
      <p><strong>📱 Telefon:</strong> ${formData.whatsapp || formData.phone || 'Nie podano'}</p>
      <p><strong>🏙️ Miasto:</strong> ${formData.city || 'Nie podano'}</p>
      <p><strong>📝 Zgoda na wizerunek:</strong> ${formData.imageConsent || 'Nie podano'}</p>
      <p><strong>💰 Suma:</strong> ${typeof amount === 'number' ? (amount / 100).toFixed(2) : amount} PLN</p>
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
    const emailResponse = await fetch(`${req.nextUrl.origin}/api/send-email`, {
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
      console.error('Failed to send email notification:', errorText);
    } else {
      console.log('✅ Email notification sent successfully');
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
      sheetsSuccess: sheetsResponse.ok,
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