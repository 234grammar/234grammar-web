import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('documents')
    .select('id, title, word_count, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { title, content, word_count } = await request.json();

  const { data, error } = await supabase
    .from('documents')
    .insert({ user_id: user.id, title, content, word_count })
    .select('id, title, content, word_count, updated_at')
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
