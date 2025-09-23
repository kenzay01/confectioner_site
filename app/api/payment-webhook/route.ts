// app/api/payment-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
      return NextResponse.json(
        { error: "Missing CRC key configuration" },
        { status: 500 }
      );
    }

    const hashString = `${merchantId}|${posId}|${sessionId}|${amount}|${originAmount}|${currency}|${orderId}|${methodId}|${statement}|${crcKey}`;
    const calculatedSign = crypto.createHash('md5').update(hashString).digest('hex');

    if (calculatedSign !== sign) {
      console.error('Invalid signature in webhook');
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Верифікація транзакції через API Przelewy24
    const isVerified = await verifyTransaction(sessionId, amount, orderId);
    
    if (!isVerified) {
      console.error('Transaction verification failed');
      return NextResponse.json(
        { error: "Transaction verification failed" },
        { status: 400 }
      );
    }

    // Якщо все ОК, повертаємо підтвердження
    console.log(`Payment confirmed for session: ${sessionId}, order: ${orderId}`);
    
    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function verifyTransaction(sessionId: string, amount: number, orderId: number) {
  try {
    const merchantId = process.env.PRZELEWY24_MERCHANT_ID;
    const posId = process.env.PRZELEWY24_POS_ID;
    const apiKey = process.env.PRZELEWY24_API_KEY;
    const crcKey = process.env.PRZELEWY24_CRC_KEY;
    const isSandbox = process.env.NODE_ENV !== "production";

    if (!merchantId || !posId || !apiKey || !crcKey) {
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

    return response.ok;

  } catch (error) {
    console.error('Error verifying transaction:', error);
    return false;
  }
}