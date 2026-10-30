import { createAdminClient } from '@/lib/supabase';
import { config } from '@/lib/config';
import { runSync } from '@/lib/sync-engine';

export async function GET(request: Request) {
  try {
    // 1. Verify CRON_SECRET security
    const authHeader = request.headers.get('Authorization');
    const expected = `Bearer ${config.cron.secret}`;

    if (!config.cron.secret || authHeader !== expected) {
      return Response.json({ error: 'Unauthorized: invalid or missing CRON_SECRET' }, { status: 401 });
    }

    // 2. Check Supabase credentials
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return Response.json(
        {
          status: 'skipped',
          message: 'Cron triggered successfully, but Supabase environment variables are not yet configured.',
        },
        { status: 200 }
      );
    }

    const supabase = createAdminClient();

    // 3. Check if sync is enabled
    const { data: settings, error: settingsError } = await supabase
      .from('sync_settings')
      .select('is_enabled')
      .limit(1)
      .maybeSingle();

    if (settings && settings.is_enabled === false) {
      return Response.json({ status: 'paused', message: 'Synchronization is currently disabled in admin settings.' }, { status: 200 });
    }

    // 4. Run the synchronization engine
    const result = await runSync();
    return Response.json({
      status: 'executed',
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown cron error';
    console.error('GET /api/cron/synchronize error:', err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
