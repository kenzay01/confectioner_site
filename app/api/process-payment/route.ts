// app/api/process-payment/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, itemType, itemId, formData, amount, status } = body;

    if (!sessionId || !itemType || !itemId || !formData) {
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
      <p><strong>👤 Imię i nazwisko:</strong> ${formData.fullName || 'Nie podano'}</p>
      <p><strong>📧 Email:</strong> ${formData.email || 'Nie podano'}</p>
      <p><strong>📱 Telefon:</strong> ${formData.phone || 'Nie podano'}</p>
      <p><strong>🏙️ Miasto:</strong> ${formData.city || 'Nie podano'}</p>
      <p><strong>📝 Zgoda na wizerunek:</strong> ${formData.imageConsent || 'Nie podano'}</p>
      <p><strong>💰 Suma:</strong> ${amount / 100} PLN</p>
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
      console.error('Failed to send email notification');
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