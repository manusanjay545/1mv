import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';
import { config } from '@/lib/config';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('site_settings')
      .select('shrinkme_url, monetization_enabled, site_name, site_description')
      .limit(1)
      .maybeSingle();

    if (data) {
      return Response.json(data);
    }
  } catch (err) {
    console.warn('GET /api/settings fallback:', err);
  }

  return Response.json({
    shrinkme_url: config.shrinkme.url,
    monetization_enabled: true,
    site_name: config.site.name,
    site_description: config.site.description,
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
      .from('site_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      const { data, error } = await supabase
        .from('site_settings')
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
        .from('site_settings')
        .insert({
          shrinkme_url: body.shrinkme_url || config.shrinkme.url,
          monetization_enabled: body.monetization_enabled ?? true,
          site_name: body.site_name || config.site.name,
          site_description: body.site_description || config.site.description,
        })
        .select()
        .single();

      if (error) {
        return Response.json({ error: error.message }, { status: 400 });
      }
      return Response.json(data);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal server error';
    return Response.json({ error: msg }, { status: 500 });
  }
}
