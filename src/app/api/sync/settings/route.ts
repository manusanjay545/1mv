import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('sync_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) {
      return Response.json(data);
    }
  } catch (err) {
    console.warn('GET /api/sync/settings fallback:', err);
  }

  return Response.json({
    id: 'default-sync',
    source_name: 'Authorized Content Partner',
    source_url: 'https://example.com/api/movies',
    feed_url: '',
    sync_interval_minutes: 15,
    is_enabled: true,
    last_sync_at: null,
    next_sync_at: null,
  });
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from('sync_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { data, error } = await supabase
        .from('sync_settings')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return Response.json({ error: error.message }, { status: 400 });
      }
      return Response.json(data);
    } else {
      const { data, error } = await supabase
        .from('sync_settings')
        .insert({
          source_name: body.source_name || 'Default Source',
          source_url: body.source_url || null,
          feed_url: body.feed_url || null,
          auth_credentials: body.auth_credentials || null,
          sync_interval_minutes: body.sync_interval_minutes || 15,
          is_enabled: body.is_enabled ?? true,
        })
        .select()
        .single();

      if (error) {
        return Response.json({ error: error.message }, { status: 400 });
      }
      return Response.json(data);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    return Response.json({ error: msg }, { status: 500 });
  }
}
