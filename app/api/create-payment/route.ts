// app/api/create-payment/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, itemType, itemId, sessionId } = body;

    // Конфігурація Przelewy24
    const merchantId = process.env.PRZELEWY24_MERCHANT_ID;
    const posId = process.env.PRZELEWY24_POS_ID;
    const crcKey = process.env.PRZELEWY24_CRC_KEY;
    const apiKey = process.env.PRZELEWY24_API_KEY;
    // const isSandbox = process.env.NODE_ENV !== "production";

    if (!merchantId || !posId || !crcKey || !apiKey) {
      return NextResponse.json(
        { error: "Missing Przelewy24 configuration" },
        { status: 500 }
      );
    }

    // Базовий URL для Przelewy24
    const baseUrl = "https://sandbox.przelewy24.pl/api/v1"
    // isSandbox 
    //   ? "https://sandbox.przelewy24.pl/api/v1" 
    //  "https://secure.przelewy24.pl/api/v1";

    // Створюємо hash для автентифікації
    const crypto = require('crypto');
    // Переконайтесь, що всі значення - рядки
    const sessionIdStr = String(sessionId);
    const merchantIdStr = String(merchantId);
    const amountStr = String(amount);
    const currencyStr = "PLN";
    const crcKeyStr = String(crcKey);

    const hashString = `${sessionId}|${merchantId}|${amount}|PLN|${crcKey}`;

    const sign = crypto.createHash('md5').update(hashString, 'utf8').digest('hex');

    // Дані для створення транзакції
    const transactionData = {
      merchantId: parseInt(merchantId),
      posId: parseInt(posId),
      sessionId: sessionId,
      amount: amount, // kwota в groszach (1 zł = 100 gr)
      currency: "PLN",
      description: `${itemType === 'masterclass' ? 'Masterclass' : 'Product'} purchase`,
      email: body.email || "customer@example.com",
      client: body.fullName || "Customer",
      address: "",
      zip: "",
      city: "",
      country: "PL",
      phone: body.whatsapp || "",
      language: "pl",
      method: 0, // wszystkie dostępne metody płatności
      urlReturn: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?sessionId=${sessionId}`,
      urlStatus: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-webhook`,
      timeLimit: 15, // limit czasu w minutach
      waitForResult: false,
      regulationAccept: true,
      sign: sign
    };

    // Podstawowa autoryzacja
    const authString = `${merchantId}:${apiKey}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    // Wysyłamy request do Przelewy24
    const response = await fetch(`${baseUrl}/transaction/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedAuth}`
      },
      body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Przelewy24 API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create payment', details: errorText },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    if (result.error) {
      console.error('Przelewy24 registration error:', result);
      return NextResponse.json(
        { error: 'Payment registration failed', details: result },
        { status: 400 }
      );
    }

    // URL do przekierowania na stronę płatności
    const paymentUrl = `https://sandbox.przelewy24.pl/trnRequest/${result.data.token}`;
    // isSandbox 
    //   ? `https://sandbox.przelewy24.pl/trnRequest/${result.data.token}`
    //   : `https://secure.przelewy24.pl/trnRequest/${result.data.token}`;

    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      token: result.data.token,
      paymentUrl: paymentUrl
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}