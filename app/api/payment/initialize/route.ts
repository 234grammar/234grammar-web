import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PLAN_AMOUNTS: Record<string, number> = {
  pro_monthly: 150000,  // ₦1,500 in kobo
  pro_yearly: 1500000,  // ₦15,000 in kobo
};

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

  const reference = crypto.randomUUID();

  const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      amount,
      reference,
      currency: 'NGN',
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`,
      metadata: {
        user_id: user.id,
        billing_cycle: billingCycle,
      },
    }),
  });

  const result = await paystackRes.json();

  if (!result.status) {
    return NextResponse.json({ message: result.message || 'Payment initialization failed.' }, { status: 502 });
  }

  return NextResponse.json({ authorization_url: result.data.authorization_url });
}
