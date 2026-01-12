// Test script for Przelewy24 CRC calculation
const crypto = require('crypto');

// Test credentials (replace with your actual values)
const merchantId = process.env.PRZELEWY24_MERCHANT_ID || "358564";
const posId = process.env.PRZELEWY24_POS_ID || "358564";
const crcKey = process.env.PRZELEWY24_CRC_KEY || "606462c46f2fa6c1";
const apiKey = process.env.PRZELEWY24_API_KEY || "bf5bde3fadfc4f178f0866e0b8ec1eff";

// Test data
const sessionId = "test_session_123";
const amount = 100.00; // 100 zł
const amountInGrosz = Math.round(amount * 100); // 10000 grosz

console.log('=== Przelewy24 CRC Test ===\n');
console.log('Configuration:');
console.log('  Merchant ID:', merchantId);
console.log('  POS ID:', posId);
console.log('  CRC Key:', crcKey);
console.log('  API Key:', apiKey ? apiKey.substring(0, 10) + '...' : 'missing');
console.log('\nTest Data:');
console.log('  Session ID:', sessionId);
console.log('  Amount:', amount, 'zł =', amountInGrosz, 'grosz');
console.log('  Currency: PLN\n');

// Create sign object
    const signObject = {
  sessionId: sessionId,
  merchantId: parseInt(merchantId),
  amount: amountInGrosz,
  currency: "PLN",
  crc: crcKey
    };

// Create JSON string
    const signString = JSON.stringify(signObject);
    const sign = crypto.createHash('sha384').update(signString, 'utf8').digest('hex');

console.log('=== Sign Calculation ===');
console.log('Sign Object:', JSON.stringify(signObject, null, 2));
    console.log('Sign String:', signString);
console.log('Calculated Sign (SHA-384):', sign);
console.log('Sign (first 30 chars):', sign.substring(0, 30) + '...\n');

// Transaction data that would be sent
    const transactionData = {
      merchantId: parseInt(merchantId),
      posId: parseInt(posId),
      sessionId: sessionId,
      amount: amountInGrosz,
      currency: "PLN",
  description: "Test purchase",
  email: "test@example.com",
  client: "Test Customer",
  address: "",
  zip: "",
  city: "",
      country: "PL",
  phone: "",
      language: "pl",
      method: 0,
      urlReturn: `https://nieznanypiekarz.com/payment-status?sessionId=${sessionId}&status=return`,
      urlStatus: `https://nieznanypiekarz.com/api/payment-webhook?sessionId=${sessionId}`,
      timeLimit: 15,
      waitForResult: false,
      regulationAccept: true,
      sign: sign
    };

console.log('=== Transaction Data (to be sent) ===');
console.log(JSON.stringify(transactionData, null, 2));
console.log('\n=== Authentication ===');
    const authString = `${posId}:${apiKey}`;
    const encodedAuth = Buffer.from(authString).toString('base64');
console.log('Auth String:', `${posId}:${apiKey ? apiKey.substring(0, 10) + '...' : 'missing'}`);
console.log('Encoded (Base64):', encodedAuth.substring(0, 20) + '...\n');

console.log('✅ Test completed!');
console.log('\nTo test with real API, use:');
console.log('  curl -X POST https://secure.przelewy24.pl/api/v1/transaction/register \\');
console.log('    -H "Content-Type: application/json" \\');
console.log(`    -H "Authorization: Basic ${encodedAuth}" \\`);
console.log(`    -d \'${JSON.stringify(transactionData)}\'`);
