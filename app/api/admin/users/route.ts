import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.email !== process.env.ADMIN_EMAIL) return null;
  return user;
}

export async function GET() {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const adminClient = getAdminClient();

  const [{ data: authData, error: authError }, { data: profiles, error: profilesError }] =
    await Promise.all([
      adminClient.auth.admin.listUsers({ perPage: 1000 }),
      adminClient.from('profiles').select('id, plan, checks_used, trial_ends_at'),
    ]);

  if (authError) return NextResponse.json({ message: authError.message }, { status: 500 });
  if (profilesError) return NextResponse.json({ message: profilesError.message }, { status: 500 });

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));

  const users = (authData.users ?? [])
    .map(u => {
      const profile = profileMap.get(u.id);
      return {
        id: u.id,
        email: u.email ?? '',
        plan: profile?.plan ?? 'free',
        checks_used: profile?.checks_used ?? 0,
        trial_ends_at: profile?.trial_ends_at ?? null,
        created_at: u.created_at,
      };
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({ users });
}

export async function PATCH(request: NextRequest) {
  const user = await assertAdmin();
  if (!user) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const { userId, plan } = await request.json();
  if (!userId || !['free', 'pro'].includes(plan)) {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { plan, trial_ends_at: null };

  const adminClient = getAdminClient();
  const { error } = await adminClient
    .from('profiles')
    .upsert({ id: userId, ...updates }, { onConflict: 'id' });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
