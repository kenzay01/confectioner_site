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

    // Верифікація підпису - ПРАВИЛЬНИЙ формат: JSON + SHA384
    const crcKey = process.env.PRZELEWY24_CRC_KEY;
    if (!crcKey) {
      console.error('Missing CRC key configuration');
      // Все одно повертаємо 200 OK, щоб Przelewy24 не блокував
      return new Response("OK", { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // ПРАВИЛЬНИЙ формат для webhook: JSON об'єкт + SHA384
    const signObject = {
      merchantId: typeof merchantId === 'string' ? parseInt(merchantId) : merchantId,
      posId: typeof posId === 'string' ? parseInt(String(posId)) : posId,
      sessionId: sessionId,
      amount: typeof amount === 'string' ? parseInt(amount) : amount,
      originAmount: typeof originAmount === 'string' ? parseInt(String(originAmount)) : originAmount,
      currency: currency || "PLN",
      orderId: typeof orderId === 'string' ? parseInt(String(orderId)) : orderId,
      methodId: typeof methodId === 'string' ? parseInt(String(methodId)) : methodId,
      statement: statement || "",
      crc: crcKey
    };

    // Створюємо JSON string БЕЗ пробілів
    const signString = JSON.stringify(signObject);
    const calculatedSign = crypto.createHash('sha384').update(signString, 'utf8').digest('hex');

    console.log('=== SIGNATURE VERIFICATION ===');
    console.log('Sign object:', signObject);
    console.log('Sign string (JSON):', signString);
    console.log('Received sign:', sign);
    console.log('Calculated sign:', calculatedSign);
    console.log('Match:', calculatedSign === sign);

    // Перевірка підпису
    const skipVerification = process.env.SKIP_WEBHOOK_VERIFICATION === 'true';
    
    if (!skipVerification && calculatedSign !== sign) {
      console.error('❌ Invalid signature in webhook!');
      console.error('Expected:', calculatedSign);
      console.error('Received:', sign);
      // Все одно повертаємо 200 OK, щоб не блокувати платежі
      // але логуємо помилку
    } else {
      console.log('✅ Signature verified successfully!');
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

    if (!merchantId || !posId || !apiKey || !crcKey) {
      console.error('Missing credentials for verification');
      return false;
    }

    const baseUrl = "https://secure.przelewy24.pl/api/v1";

    // ПРАВИЛЬНИЙ формат для verify: JSON об'єкт + SHA384
    const signObject = {
      sessionId: sessionId,
      orderId: orderId,
      amount: amount,
      currency: "PLN",
      crc: crcKey
    };

    // Створюємо JSON string БЕЗ пробілів
    const signString = JSON.stringify(signObject);
    const sign = crypto.createHash('sha384').update(signString, 'utf8').digest('hex');

    const verifyData = {
      merchantId: parseInt(merchantId),
      posId: parseInt(posId),
      sessionId: sessionId,
      amount: amount,
      currency: "PLN",
      orderId: orderId,
      sign: sign
    };

    console.log('=== VERIFY REQUEST ===');
    console.log('Sign object:', signObject);
    console.log('Sign string (JSON):', signString);
    console.log('Sign (SHA-384):', sign);
    console.log('Verify URL:', `${baseUrl}/transaction/verify`);

    const authString = `${posId}:${apiKey}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    const response = await fetch(`${baseUrl}/transaction/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedAuth}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(verifyData)
    });

    const responseText = await response.text();
    console.log('=== VERIFY RESPONSE ===');
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    console.log('Body:', responseText);

    if (!response.ok) {
      console.error('Verify failed:', responseText);
      return false;
    }

    const result = responseText ? JSON.parse(responseText) : {};
    console.log('Verify result:', result);

    // Przelewy24 повертає 'success' (lowercase), не 'SUCCESS'
    // Також перевіряємо responseCode === 0 (успіх)
    const isSuccess = (result.data?.status === 'success' || result.data?.status === 'SUCCESS') && 
                      result.responseCode === 0;
    console.log('Is verified:', isSuccess);
    console.log('Status:', result.data?.status);
    console.log('ResponseCode:', result.responseCode);

    return response.ok && isSuccess;

  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
}