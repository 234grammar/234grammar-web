import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendPaymentSuccessEmail } from '@/lib/email/resend';

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

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const transactionReference = searchParams.get('transactionReference');
  const paymentReference = searchParams.get('paymentReference');

  if (!transactionReference && !paymentReference) {
    return NextResponse.redirect(`${origin}/editor?payment=failed&reason=no_reference`);
  }

  try {
    const token = await getMonnifyToken();

    const url = transactionReference
      ? `${MONNIFY_BASE}/api/v2/transactions/${encodeURIComponent(transactionReference)}`
      : `${MONNIFY_BASE}/api/v1/merchant/transactions/query?paymentReference=${encodeURIComponent(paymentReference!)}`;

    const monnifyRes = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await monnifyRes.json();

    if (!result.requestSuccessful || result.responseBody?.paymentStatus !== 'PAID') {
      return NextResponse.redirect(`${origin}/editor?payment=failed&reason=verification`);
    }

    const userId: string | undefined = result.responseBody.metaData?.user_id;
    const email: string = result.responseBody.customerEmail;

    if (!userId) {
      return NextResponse.redirect(`${origin}/editor?payment=failed&reason=no_user`);
    }

    // Update profile to pro (upsert handles users who have no profile row yet)
    const serviceClient = await createServiceClient();
    await serviceClient
      .from('profiles')
      .upsert({ id: userId, plan: 'pro', trial_ends_at: null }, { onConflict: 'id' });

    // Fire-and-forget confirmation email
    if (email) {
      sendPaymentSuccessEmail({ email }).catch((err) =>
        console.error('Payment success email failed:', err)
      );
    }

    return NextResponse.redirect(`${origin}/welcome?plan=pro&payment=success`);
  } catch (err) {
    console.error('Monnify verify error:', err);
    return NextResponse.redirect(`${origin}/editor?payment=failed&reason=verification`);
  }
}
