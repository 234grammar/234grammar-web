import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { sendContactNotification } from '@/lib/email/resend';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, message } = body;

  if (!email || !message) {
    return NextResponse.json({ message: 'Email and message are required.' }, { status: 400 });
  }

  // Store in DB
  const serviceClient = await createServiceClient();
  const { error } = await serviceClient.from('contact_submissions').insert({
    category: body.category ?? null,
    first_name: body.firstName ?? null,
    last_name: body.lastName ?? null,
    email,
    subject: body.subject ?? null,
    message,
  });

  if (error) {
    console.error('Contact insert error:', error);
    // Don't surface DB errors to user — still try to send email
  }

  // Notify via email
  sendContactNotification({
    category: body.category,
    firstName: body.firstName,
    lastName: body.lastName,
    email,
    subject: body.subject,
    message,
  }).catch((err) => console.error('Contact notification email failed:', err));

  return NextResponse.json({ ok: true });
}
