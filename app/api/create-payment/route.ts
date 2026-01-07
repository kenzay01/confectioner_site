// app/api/create-payment/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, itemType, sessionId } = body;

    // Production configuration
    const merchantId = process.env.PRZELEWY24_MERCHANT_ID;
    const posId = process.env.PRZELEWY24_POS_ID;
    const crcKey = process.env.PRZELEWY24_CRC_KEY;
    const apiKey = process.env.PRZELEWY24_API_KEY;

    // Validate all credentials
    if (!merchantId || !posId || !crcKey || !apiKey) {
      console.error('Missing Przelewy24 configuration:', {
        merchantId: merchantId ? 'Set' : 'Missing',
        posId: posId ? 'Set' : 'Missing',
        crcKey: crcKey ? 'Set' : 'Missing',
        apiKey: apiKey ? 'Set' : 'Missing'
      });
      return NextResponse.json(
        { error: "Missing Przelewy24 configuration" },
        { status: 500 }
      );
    }

    // Production URL
    const baseUrl = "https://secure.przelewy24.pl/api/v1";

    // Convert amount to grosz (1 zł = 100 gr)
    const amountInGrosz = Math.round(amount * 100);

    // Create sign according to Przelewy24 documentation
    const signObject = {
      "sessionId": sessionId,
      "merchantId": parseInt(merchantId),
      "amount": amountInGrosz,
      "currency": "PLN",
      "crc": crcKey
    };

    // Create JSON string WITHOUT spaces and line breaks
    const signString = JSON.stringify(signObject);
    const sign = crypto.createHash('sha384').update(signString, 'utf8').digest('hex');

    console.log('Payment request:', {
      sessionId,
      merchantId,
      posId,
      amount: amountInGrosz,
      signPreview: sign.substring(0, 20) + '...'
    });

    // Transaction data
    const transactionData = {
      merchantId: parseInt(merchantId),
      posId: parseInt(posId),
      sessionId: sessionId,
      amount: amountInGrosz,
      currency: "PLN",
      description: `${itemType === 'masterclass' ? 'Masterclass' : 'Product'} purchase`,
      email: body.email || "customer@example.com",
      client: body.fullName || "Customer",
      address: body.address || "",
      zip: body.zip || "",
      city: body.city || "",
      country: "PL",
      phone: body.phone || "",
      language: "pl",
      method: 0,
      urlReturn: `https://nieznanypiekarz.com/payment-status?sessionId=${sessionId}&status=return`,
      urlStatus: `https://nieznanypiekarz.com/api/payment-webhook?sessionId=${sessionId}`,
      timeLimit: 15,
      waitForResult: false,
      regulationAccept: true,
      sign: sign
    };

    // Authentication for Przelewy24
    const authString = `${posId}:${apiKey}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    console.log('Sending request to Przelewy24...');

    // Send request to Przelewy24
    const response = await fetch(`${baseUrl}/transaction/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedAuth}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(transactionData)
    });

    const responseText = await response.text();
    console.log('Przelewy24 response status:', response.status);
    console.log('Przelewy24 response:', responseText);

    if (!response.ok) {
      console.error('Przelewy24 API error:', responseText);
      return NextResponse.json(
        { error: 'Failed to create payment', details: responseText },
        { status: response.status }
      );
    }

    const result = JSON.parse(responseText);

    if (result.error) {
      console.error('Przelewy24 registration error:', result);
      return NextResponse.json(
        { error: 'Payment registration failed', details: result },
        { status: 400 }
      );
    }

    // Payment URL
    const paymentUrl = `https://secure.przelewy24.pl/trnRequest/${result.data.token}`;

    console.log('Payment created successfully:', {
      sessionId,
      token: result.data.token
    });

    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      token: result.data.token,
      paymentUrl: paymentUrl
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}