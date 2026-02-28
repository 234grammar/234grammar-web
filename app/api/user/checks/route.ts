import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { checksUsed } = await request.json();

  if (typeof checksUsed !== 'number') {
    return NextResponse.json({ message: 'checksUsed must be a number.' }, { status: 400 });
  }

  // Fetch current profile to check if monthly reset is needed
  const { data: profile, error: fetchError } = await supabase
    .from('profiles')
    .select('checks_reset_at, plan')
    .eq('id', user.id)
    .single();

  if (fetchError) {
    return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
  }

  const now = new Date();
  const resetAt = new Date(profile.checks_reset_at);
  const needsReset = now >= resetAt;

  if (needsReset) {
    // Reset counter and advance reset_at to next month
    const nextReset = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)
    );
    await supabase
      .from('profiles')
      .update({ checks_used: 1, checks_reset_at: nextReset.toISOString() })
      .eq('id', user.id);

    return NextResponse.json({ checks_used: 1, reset: true });
  }

  const { error } = await supabase
    .from('profiles')
    .update({ checks_used: checksUsed })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ checks_used: checksUsed, reset: false });
}
