import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';
import { runSync } from '@/lib/sync-engine';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await runSync();
    return Response.json(result);
  } catch (err) {
    console.error('POST /api/sync error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Fetch sync settings
    const { data: settings, error: settingsError } = await supabase
      .from('sync_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError) {
      return Response.json({ error: settingsError.message }, { status: 500 });
    }

    // Fetch recent sync logs
    const { data: logs, error: logsError } = await supabase
      .from('sync_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10);

    if (logsError) {
      return Response.json({ error: logsError.message }, { status: 500 });
    }

    return Response.json({ settings, logs: logs ?? [] });
  } catch (err) {
    console.error('GET /api/sync error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
