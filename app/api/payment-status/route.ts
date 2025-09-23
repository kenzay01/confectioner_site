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

    const merchantId = process.env.PRZELEWY24_MERCHANT_ID;
    const posId = process.env.PRZELEWY24_POS_ID;
    const apiKey = process.env.PRZELEWY24_API_KEY;
    const isSandbox = process.env.NODE_ENV !== "production";

    if (!merchantId || !posId || !apiKey) {
      return NextResponse.json(
        { error: "Missing Przelewy24 configuration" },
        { status: 500 }
      );
    }

    const baseUrl = isSandbox 
      ? "https://sandbox.przelewy24.pl/api/v1" 
      : "https://secure.przelewy24.pl/api/v1";

    // Podstawowa autoryzacja
    const authString = `${posId}:${apiKey}`;
    const encodedAuth = Buffer.from(authString).toString('base64');

    // Pobieramy informacje o transakcji
    const response = await fetch(`${baseUrl}/transaction/by/sessionId/${sessionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedAuth}`,
        'Content-Type': 'application/json'
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

    // Mapujemy status z Przelewy24 na nasze statusy
    let status = "unknown";
    if (result.data && result.data.length > 0) {
      const transaction = result.data[0];
      switch (transaction.status) {
        case 1: // rozpoczęta
          status = "created";
          break;
        case 2: // w trakcie
          status = "processing";
          break;
        case 3: // anulowana
          status = "failure";
          break;
        case 4: // odrzucona
          status = "failure";
          break;
        case 5: // wykonana
          status = "success";
          break;
        case 6: // zwrócona
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