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

    // Відправляємо дані в Google Sheets - вимкнено
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    // const sheetsResponse = await fetch(`${baseUrl}/api/google-sheets`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     type: 'payment',
    //     data: {
    //       ...formData,
    //       itemType,
    //       itemId,
    //       amount,
    //       sessionId,
    //       paymentStatus: status,
    //     }
    //   })
    // });

    // if (!sheetsResponse.ok) {
    //   const errorText = await sheetsResponse.text();
    //   console.error('Failed to add data to Google Sheets:', errorText);
    // } else {
    //   console.log('✅ Data added to Google Sheets successfully');
    // }

    // Get masterclass details if it's a masterclass payment
    let masterclassDetails = '';
    if (itemType === 'masterclass' && itemId) {
      try {
        const fileContents = await fs.readFile(masterclassesFile, "utf-8");
        const masterclasses = JSON.parse(fileContents) as Masterclass[];
        
        // itemId може бути в форматі "masterclass-123" або просто "123"
        const cleanItemId = itemId.replace('masterclass-', '');
        const masterclass = masterclasses.find(m => m.id === cleanItemId || m.id === itemId);
        
        console.log('Looking for masterclass with itemId:', itemId, 'cleanItemId:', cleanItemId);
        
        if (masterclass) {
          console.log('Masterclass found:', masterclass.title.pl);
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
        } else {
          console.warn('Masterclass not found for itemId:', itemId, 'Available IDs:', masterclasses.map(m => m.id));
        }
      } catch (error) {
        console.error('Error reading masterclass details:', error);
      }
    }

    // Підготовка email повідомлення
    const isPaid = status === 'success';
    const statusEmoji = isPaid ? '✅' : '❌';
    const statusText = isPaid ? 'ОПЛАЧЕНО' : 'НЕ ОПЛАЧЕНО';
    const fromWebhook = body.fromWebhook ? ' [Webhook]' : '';
    
    const subject = `${statusEmoji} Nowe zamówienie - ${statusText}${fromWebhook}`;
    
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