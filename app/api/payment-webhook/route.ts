// app/api/payment-webhook/route.ts
import { NextRequest } from "next/server";
import crypto from 'crypto';

interface WebhookBody {
  merchantId?: number | string;
  posId?: number | string;
  sessionId?: string;
  amount?: number | string;
  originAmount?: number | string;
  currency?: string;
  orderId?: number | string;
  methodId?: number | string;
  statement?: string;
  sign?: string;
  [key: string]: unknown;
}

// Обробка OPTIONS запиту (CORS preflight)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Przelewy24 може надсилати дані як JSON або як form-data
    let body: WebhookBody;
    const contentType = req.headers.get('content-type');
    
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Content-Type:', contentType);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));
    
    if (contentType?.includes('application/json')) {
      body = await req.json() as WebhookBody;
    } else {
      // Якщо це form-data, парсимо вручну
      const formData = await req.formData();
      const formEntries: WebhookBody = {};
      for (const [key, value] of formData.entries()) {
        formEntries[key] = value;
      }
      body = formEntries;
      // Конвертуємо числові значення
      if (body.amount) body.amount = parseInt(String(body.amount));
      if (body.originAmount) body.originAmount = parseInt(String(body.originAmount));
      if (body.orderId) body.orderId = parseInt(String(body.orderId));
      if (body.methodId) body.methodId = parseInt(String(body.methodId));
      if (body.merchantId) body.merchantId = parseInt(String(body.merchantId));
      if (body.posId) body.posId = parseInt(String(body.posId));
    }
    
    console.log('Webhook body:', JSON.stringify(body, null, 2));

    const { 
      merchantId, 
      posId, 
      sessionId, 
      amount, 
      originAmount, 
      currency, 
      orderId, 
      methodId, 
      statement, 
      sign 
    } = body;

    // Верифікація підпису
    const crcKey = process.env.PRZELEWY24_CRC_KEY;
    if (!crcKey) {
      console.error('Missing CRC key configuration');
      // Все одно повертаємо 200 OK, щоб Przelewy24 не блокував
      return new Response("OK", { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const hashString = `${merchantId}|${posId}|${sessionId}|${amount}|${originAmount}|${currency}|${orderId}|${methodId}|${statement}|${crcKey}`;
    const calculatedSign = crypto.createHash('md5').update(hashString).digest('hex');

    console.log('=== SIGNATURE VERIFICATION ===');
    console.log('Hash string:', hashString);
    console.log('Received sign:', sign);
    console.log('Calculated sign:', calculatedSign);
    console.log('Match:', calculatedSign === sign);

    // ТИМЧАСОВО: завжди приймаємо webhook для діагностики
    // Після виправлення можна включити перевірку підпису
    const skipVerification = process.env.SKIP_WEBHOOK_VERIFICATION === 'true';
    
    if (!skipVerification && calculatedSign !== sign) {
      console.error('Invalid signature in webhook');
      // Все одно повертаємо 200 OK, щоб не блокувати платежі
      // але логуємо помилку
    }

    // Верифікація транзакції через API Przelewy24
    console.log('=== VERIFYING TRANSACTION ===');
    let isVerified = false;
    if (sessionId && amount !== undefined && orderId !== undefined) {
      const amountNum = typeof amount === 'string' ? parseInt(amount) : amount;
      const orderIdNum = typeof orderId === 'string' ? parseInt(String(orderId)) : orderId;
      isVerified = await verifyTransaction(sessionId, amountNum, orderIdNum);
    } else {
      console.warn('Missing required fields for verification:', { sessionId, amount, orderId });
    }
    
    console.log('Transaction verified:', isVerified);

    // Обробляємо успішний платіж: зменшуємо кількість місць для masterclass
    if (isVerified && sessionId) {
      try {
        // Витягуємо itemType та itemId з sessionId (формат: "masterclass_masterclass-123_timestamp")
        const sessionParts = sessionId.split('_');
        if (sessionParts.length >= 2 && sessionParts[0] === 'masterclass') {
          const itemId = sessionParts[1]; // "masterclass-123"
          const masterclassId = itemId.replace('masterclass-', ''); // "123"
          
          console.log('Reducing slot for masterclass:', masterclassId);
          
          // Зменшуємо кількість місць
          const reduceSlotResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://nieznanypiekarz.com'}/api/masterclasses/${masterclassId}/reduce-slot`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (reduceSlotResponse.ok) {
            const reduceSlotResult = await reduceSlotResponse.json();
            console.log('Slot reduced successfully:', reduceSlotResult);
          } else {
            console.error('Failed to reduce slot:', await reduceSlotResponse.text());
    }
        }
      } catch (error) {
        console.error('Error reducing masterclass slot in webhook:', error);
        // Не блокуємо webhook при помилці
      }
    }

    // Завжди повертаємо 200 OK для Przelewy24
    console.log(`=== WEBHOOK PROCESSED: session=${sessionId}, order=${orderId} ===`);
    
    return new Response("OK", { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

  } catch (error) {
    console.error('=== ERROR PROCESSING WEBHOOK ===');
    console.error('Error:', error);
    // Навіть при помилці повертаємо 200 OK
    return new Response("OK", { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}

async function verifyTransaction(sessionId: string, amount: number, orderId: number) {
  try {
    const merchantId = process.env.PRZELEWY24_MERCHANT_ID;
    const posId = process.env.PRZELEWY24_POS_ID;
    const apiKey = process.env.PRZELEWY24_API_KEY;
    const crcKey = process.env.PRZELEWY24_CRC_KEY;
    const isSandbox = false; // production mode

    if (!merchantId || !posId || !apiKey || !crcKey) {
      console.error('Missing credentials for verification');
      return false;
    }

    const baseUrl = isSandbox 
      ? "https://sandbox.przelewy24.pl/api/v1" 
      : "https://secure.przelewy24.pl/api/v1";

    // Створюємо hash для верифікації
    const hashString = `${sessionId}|${orderId}|${amount}|${crcKey}`;
    const sign = crypto.createHash('md5').update(hashString).digest('hex');

    const verifyData = {
      merchantId: parseInt(merchantId),
      posId: parseInt(posId),
      sessionId: sessionId,
      amount: amount,
      currency: "PLN",
      orderId: orderId,
      sign: sign
    };

    console.log('Verify request:', {
      url: `${baseUrl}/transaction/verify`,
      data: { ...verifyData, sign: sign.substring(0, 20) + '...' }
    });

    const authString = `${posId}:${apiKey}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    const response = await fetch(`${baseUrl}/transaction/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedAuth}`
      },
      body: JSON.stringify(verifyData)
    });

    const responseText = await response.text();
    console.log('Verify response:', {
      status: response.status,
      ok: response.ok,
      body: responseText
    });

    return response.ok;

  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
}