// app/api/payment-status/route.ts
import { NextRequest, NextResponse } from "next/server";

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
    const isSandbox = true; // завжди true для тестування
    
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

    const baseUrl = "https://sandbox.przelewy24.pl/api/v1"

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
    
    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error
      });
    }

    // Мапим статус з Przelewy24 на наші статуси
    let status = "unknown";
    if (result.data && result.data.length > 0) {
      const transaction = result.data[0];
      switch (transaction.status) {
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
          status = "unknown";
      }
    }

    return NextResponse.json({
      success: true,
      status: status,
      data: result.data || []
    });

  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}