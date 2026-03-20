import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error: dbError } = await adminClient
    .from('contact_submissions')
    .select('id, name, email, subject, message, created_at')
    .order('created_at', { ascending: false });

  if (dbError) return NextResponse.json({ message: dbError.message }, { status: 500 });

  return NextResponse.json({ contacts: data });
}
