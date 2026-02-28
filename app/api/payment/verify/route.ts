import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendPaymentSuccessEmail } from '@/lib/email/resend';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  if (!reference) {
    return NextResponse.redirect(`${origin}/editor?payment=failed&reason=no_reference`);
  }

  // Verify with Paystack
  const paystackRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    }
  );

  const result = await paystackRes.json();

  if (!result.status || result.data?.status !== 'success') {
    return NextResponse.redirect(`${origin}/editor?payment=failed&reason=verification`);
  }

  const userId: string | undefined = result.data.metadata?.user_id;
  const email: string = result.data.customer?.email;

  if (!userId) {
    return NextResponse.redirect(`${origin}/editor?payment=failed&reason=no_user`);
  }

  // Update profile to pro
  const serviceClient = await createServiceClient();
  await serviceClient
    .from('profiles')
    .update({ plan: 'pro', trial_ends_at: null })
    .eq('id', userId);

  // Fire-and-forget confirmation email
  if (email) {
    sendPaymentSuccessEmail({ email }).catch((err) =>
      console.error('Payment success email failed:', err)
    );
  }

  return NextResponse.redirect(`${origin}/welcome?plan=pro&payment=success`);
}
