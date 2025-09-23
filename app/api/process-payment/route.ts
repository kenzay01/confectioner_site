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
    const sheetsResponse = await fetch("/api/google-sheets", {
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

    // Підготовка повідомлення для Telegram
    const isPaid = status === 'success';
    const statusEmoji = isPaid ? '✅' : '❌';
    const statusText = isPaid ? 'ОПЛАЧЕНО' : 'НЕ ОПЛАЧЕНО';
    
    let telegramMessage = `${statusEmoji} **НОВЕ ЗАМОВЛЕННЯ** \\(${statusText}\\)\n\n`;
    telegramMessage += `📝 **Тип**: ${itemType === 'masterclass' ? 'Мастеркласс' : 'Товар'}\n`;
    telegramMessage += `🆔 **ID**: ${itemId}\n`;
    telegramMessage += `👤 **Ім\\'я**: ${formData.fullName || 'Не вказано'}\n`;
    telegramMessage += `📧 **Email**: ${formData.email || 'Не вказано'}\n`;
    telegramMessage += `📱 **WhatsApp**: ${formData.whatsapp || 'Не вказано'}\n`;
    telegramMessage += `🏢 **Місце роботи**: ${formData.workplace || 'Не вказано'}\n`;
    telegramMessage += `👔 **Професія**: ${formData.profession || 'Не вказано'}\n`;
    telegramMessage += `💰 **Сума**: ${amount / 100} PLN\n`;
    telegramMessage += `🆔 **Session ID**: ${sessionId}\n`;
    
    if (formData.invoiceNeeded) {
      telegramMessage += `\n📋 **ДАНІ ДЛЯ ФАКТУРИ**:\n`;
      telegramMessage += `🏢 **Назва компанії**: ${formData.companyName || 'Не вказано'}\n`;
      telegramMessage += `🔢 **NIP**: ${formData.nip || 'Не вказано'}\n`;
      telegramMessage += `📍 **Адреса**: ${formData.companyAddress || 'Не вказано'}\n`;
    }

    // Відправляємо повідомлення в Telegram
    const telegramResponse = await fetch("/api/send-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: telegramMessage
      })
    });

    if (!telegramResponse.ok) {
      console.error('Failed to send Telegram message');
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
      telegramSuccess: telegramResponse.ok
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}