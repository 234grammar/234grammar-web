import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { sendWelcomeEmail } from '@/lib/email/resend';

export async function POST(request: NextRequest) {
  const { email, password, plan = 'free' } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  if (!data.user) {
    return NextResponse.json({ message: 'Signup failed. Please try again.' }, { status: 500 });
  }

  // Insert profile using service role (bypasses RLS)
  const serviceClient = await createServiceClient();
  const { error: profileError } = await serviceClient.from('profiles').insert({
    id: data.user.id,
    email,
    plan,
  });

  if (profileError && profileError.code !== '23505') {
    // 23505 = unique violation — user already exists, safe to ignore
    console.error('Profile insert error:', profileError);
  }

  // Fire-and-forget welcome email (don't block signup on email failure)
  sendWelcomeEmail({ email, plan }).catch((err) =>
    console.error('Welcome email failed:', err)
  );

  return NextResponse.json({ message: 'verify_email', email });
}
