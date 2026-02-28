import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/editor';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Set trial_ends_at if user is on pro_trial and it hasn't been set yet
  const serviceClient = await createServiceClient();
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('plan, trial_ends_at')
    .eq('id', data.user.id)
    .single();

  if (profile?.plan === 'pro_trial' && !profile.trial_ends_at) {
    const trialEnds = new Date();
    trialEnds.setDate(trialEnds.getDate() + 7);
    await serviceClient
      .from('profiles')
      .update({ trial_ends_at: trialEnds.toISOString() })
      .eq('id', data.user.id);
  }

  return NextResponse.redirect(`${origin}${next}?verified=true`);
}
