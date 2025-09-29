// app/api/create-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, itemType, sessionId } = body;

    // Конфігурація Przelewy24
    // Для sandbox використовуємо тестові дані
    const isSandbox = true; // завжди true для тестування
    
    let merchantId, posId, crcKey, apiKey;
    
    if (isSandbox) {
      // Використовуємо ваші реальні дані з панелі Przelewy24
      merchantId = "358564";
      posId = "358564";
      crcKey = "606462c46f2fa6c1"; // Новий згенерований CRC ключ
      apiKey = "bf5bde3fadfc4f178f0866e0b8ec1eff"; // "Ключ до звітів"
    } else {
      merchantId = process.env.PRZELEWY24_MERCHANT_ID;
      posId = process.env.PRZELEWY24_POS_ID;
      crcKey = process.env.PRZELEWY24_CRC_KEY;
      apiKey = process.env.PRZELEWY24_API_KEY;
    }

    if (!merchantId || !posId || !crcKey || !apiKey) {
      console.error('Missing Przelewy24 configuration:');
      console.error('MerchantId:', merchantId ? 'Set' : 'Missing');
      console.error('PosId:', posId ? 'Set' : 'Missing');
      console.error('CRC Key:', crcKey ? 'Set' : 'Missing');
      console.error('API Key:', apiKey ? 'Set' : 'Missing');
      return NextResponse.json(
        { error: "Missing Przelewy24 configuration" },
        { status: 500 }
      );
    }

    // Базовий URL для Przelewy24 - спробуємо sandbox для тестування
    const baseUrl = "https://sandbox.przelewy24.pl/api/v1"

    // Створюємо hash для автентифікації
    
    // Конвертуємо amount в grosz (1 zł = 100 gr)
    const amountInGrosz = Math.round(amount * 100);
    
    // Переконайтесь, що всі значення - рядки
    const sessionIdStr = String(sessionId);
    const merchantIdStr = String(merchantId);
    const amountStr = String(amountInGrosz);
    const currencyStr = "PLN";
    const crcKeyStr = String(crcKey);

    // Формат hash string для Przelewy24: sessionId|merchantId|amount|currency|crcKey
    // Очищаємо всі значення від пробілів та перевіряємо кодування
    const cleanSessionId = sessionIdStr.trim();
    const cleanMerchantId = merchantIdStr.trim();
    const cleanAmount = amountStr.trim();
    const cleanCurrency = currencyStr.trim();
    const cleanCrcKey = crcKeyStr.trim();
    
    // Правильний CRC розрахунок згідно з документацією Przelewy24
    // Використовуємо SHA-384 та JSON формат
    const params = {
      sessionId: cleanSessionId,
      merchantId: parseInt(cleanMerchantId),
      amount: parseInt(cleanAmount),
      currency: cleanCurrency,
      crc: cleanCrcKey
    };
    
    // Створюємо JSON рядок з правильними параметрами
    const combinedString = JSON.stringify(params, null, 0);
    const sign = crypto.createHash('sha384').update(combinedString, 'utf8').digest('hex');


    // Дані для створення транзакції
    const transactionData = {
      merchantId: parseInt(merchantId),
      posId: parseInt(posId),
      sessionId: sessionId,
      amount: amountInGrosz, // kwota в groszach (1 zł = 100 gr)
      currency: "PLN",
      description: `${itemType === 'masterclass' ? 'Masterclass' : 'Product'} purchase`,
      email: body.email || "customer@example.com",
      client: body.fullName || "Customer",
      address: "",
      zip: "",
      // city provided from form if available
      country: "PL",
      phone: body.phone || "",
      city: body.city || "",
      language: "pl",
      method: 0, // wszystkie dostępne metody płatności
      urlReturn: `https://confectioner-site.vercel.app/payment-status?sessionId=${sessionId}&status=return`,
      urlStatus: `https://confectioner-site.vercel.app/api/payment-webhook?sessionId=${sessionId}`,
      timeLimit: 15, // limit czasu w minutach
      waitForResult: false,
      regulationAccept: true,
      sign: sign
    };

    // Автентифікація для Przelewy24
    const authString = `${posId}:${apiKey}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
    


    // Wysyłamy request do Przelewy24
    const response = await fetch(`${baseUrl}/transaction/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedAuth}`,
        'Accept': 'application/json'
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

    // URL do przekierowania на стронę płатності - sandbox
    const paymentUrl = `https://sandbox.przelewy24.pl/trnRequest/${result.data.token}`;

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