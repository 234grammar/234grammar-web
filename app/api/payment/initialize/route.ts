import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PLAN_AMOUNTS: Record<string, number> = {
  pro_monthly: 1500,   // ₦1,500
  pro_yearly: 15000,   // ₦15,000
};

const MONNIFY_BASE = process.env.MONNIFY_BASE_URL ?? 'https://api.monnify.com';

async function getMonnifyToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MONNIFY_API_KEY}:${process.env.MONNIFY_SECRET_KEY}`
  ).toString('base64');

  const res = await fetch(`${MONNIFY_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();
  if (!data.requestSuccessful) {
    throw new Error('Monnify authentication failed');
  }
  return data.responseBody.accessToken;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { billingCycle = 'pro_monthly' } = await request.json();

  const amount = PLAN_AMOUNTS[billingCycle];
  if (!amount) {
    return NextResponse.json({ message: 'Invalid billing cycle.' }, { status: 400 });
  }

  try {
    const token = await getMonnifyToken();
    const paymentReference = crypto.randomUUID();

    const monnifyRes = await fetch(`${MONNIFY_BASE}/api/v1/merchant/transactions/init-transaction`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        customerName: user.email,
        customerEmail: user.email,
        paymentReference,
        paymentDescription: `234Grammar Pro ${billingCycle === 'pro_yearly' ? 'Yearly' : 'Monthly'}`,
        currencyCode: 'NGN',
        contractCode: process.env.MONNIFY_CONTRACT_CODE,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`,
        paymentMethods: ['CARD', 'ACCOUNT_TRANSFER', 'USSD', 'PHONE_NUMBER'],
        metaData: {
          user_id: user.id,
          billing_cycle: billingCycle,
        },
      }),
    });

    const result = await monnifyRes.json();

    if (!result.requestSuccessful) {
      return NextResponse.json({ message: result.responseMessage || 'Payment initialization failed.' }, { status: 502 });
    }

    return NextResponse.json({ authorization_url: result.responseBody.checkoutUrl });
  } catch (err) {
    console.error('Monnify init error:', err);
    return NextResponse.json({ message: 'Payment initialization failed.' }, { status: 502 });
  }
}
