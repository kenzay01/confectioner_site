// app/api/payment-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId parameter" },
        { status: 400 }
      );
    }

    // Конфігурація Przelewy24 - використовуємо ту ж логіку, що і в create-payment
    const isSandbox = false; // production mode
    
    let merchantId, posId, apiKey;
    
    if (isSandbox) {
      // Використовуємо ті ж реальні дані з панелі Przelewy24, що і в create-payment
      merchantId = "358564";
      posId = "358564";
      apiKey = "bf5bde3fadfc4f178f0866e0b8ec1eff"; // "Ключ до звітів"
    } else {
      merchantId = process.env.PRZELEWY24_MERCHANT_ID;
      posId = process.env.PRZELEWY24_POS_ID;
      apiKey = process.env.PRZELEWY24_API_KEY;
    }

    if (!merchantId || !posId || !apiKey) {
      console.error('Missing Przelewy24 configuration:');
      console.error('MerchantId:', merchantId ? 'Set' : 'Missing');
      console.error('PosId:', posId ? 'Set' : 'Missing');
      console.error('API Key:', apiKey ? 'Set' : 'Missing');
      return NextResponse.json(
        { error: "Missing Przelewy24 configuration" },
        { status: 500 }
      );
    }

    const baseUrl = "https://secure.przelewy24.pl/api/v1"

    // Автентифікація для Przelewy24 - використовуємо ті ж дані
    const authString = `${posId}:${apiKey}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    // Получаем информацию о транзакции
    const response = await fetch(`${baseUrl}/transaction/by/sessionId/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: true,
          status: "not_found",
          message: "Transaction not found"
        });
      }
      
      const errorText = await response.text();
      console.error('Przelewy24 status check error:', errorText);
      console.error('Response status:', response.status);
      console.error('Auth string used:', authString);
      return NextResponse.json(
        { error: 'Failed to check payment status', details: errorText },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    console.log('=== PAYMENT STATUS CHECK ===');
    console.log('SessionId:', sessionId);
    console.log('Przelewy24 response:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.error('Przelewy24 returned error:', result.error);
      return NextResponse.json({
        success: false,
        status: "unknown",
        error: result.error
      });
    }

    // Мапим статус з Przelewy24 на наші статуси
    let status = "unknown";
    
    // Przelewy24 може повертати дані в різних форматах
    let transaction = null;
    
    if (result.data) {
      // Якщо це масив
      if (Array.isArray(result.data) && result.data.length > 0) {
        transaction = result.data[0];
      } 
      // Якщо це об'єкт
      else if (typeof result.data === 'object' && result.data.status !== undefined) {
        transaction = result.data;
      }
    }
    
    // Якщо дані на верхньому рівні
    if (!transaction && result.status !== undefined) {
      transaction = result;
    }
    
    console.log('Transaction found:', transaction);
    
    if (transaction) {
      const transactionStatus = transaction.status;
      console.log('Transaction status code:', transactionStatus);
      
      switch (transactionStatus) {
        case 0: // нова транзакція (pending/created)
          status = "created";
          break;
        case 1: // початок
          status = "created";
          break;
        case 2: // в процесі
          status = "processing";
          break;
        case 3: // скасована
          status = "failure";
          break;
        case 4: // відхилена
          status = "failure";
          break;
        case 5: // виконана
          status = "success";
          break;
        case 6: // повернута
          status = "reversed";
          break;
        default:
          console.warn('Unknown transaction status:', transactionStatus);
          status = "unknown";
      }
    } else {
      console.warn('No transaction data found in response');
    }

    console.log('Mapped status:', status);

    // Якщо статус ще processing або created, але є orderId, перевіряємо через verify API
    // Це потрібно, бо Przelewy24 може ще не оновити статус в transaction/by/sessionId,
    // але verify API вже підтвердить успішний платіж
    if ((status === 'processing' || status === 'created') && transaction?.orderId) {
      console.log('Status is processing/created, checking via verify API...');
      const crcKey = process.env.PRZELEWY24_CRC_KEY;
      
      if (crcKey) {
        try {
          const verifyStatus = await verifyTransactionStatus(
            sessionId,
            transaction.orderId,
            transaction.amount,
            merchantId,
            posId,
            apiKey,
            crcKey
          );
          
          if (verifyStatus === 'success') {
            console.log('✅ Verify API confirms success, overriding status');
            status = 'success';
          }
        } catch (error) {
          console.error('Error verifying transaction status:', error);
          // Продовжуємо з поточним статусом
        }
      }
    }

    return NextResponse.json({
      success: true,
      status: status,
      data: transaction || result.data || []
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function verifyTransactionStatus(
  sessionId: string,
  orderId: number,
  amount: number,
  merchantId: string,
  posId: string,
  apiKey: string,
  crcKey: string
): Promise<string> {
  try {
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

    if (!response.ok) {
      return 'unknown';
    }

    const responseText = await response.text();
    const result = responseText ? JSON.parse(responseText) : {};

    // Przelewy24 повертає 'success' (lowercase)
    const isSuccess = (result.data?.status === 'success' || result.data?.status === 'SUCCESS') && 
                      result.responseCode === 0;

    return isSuccess ? 'success' : 'unknown';

  } catch (error) {
    console.error('Error in verifyTransactionStatus:', error);
    return 'unknown';
  }
}