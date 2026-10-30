import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import type { PaginatedResponse, SyncLog } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const searchParams = request.nextUrl.searchParams;

    const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
    const pageSize = searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from('sync_logs')
      .select('*', { count: 'exact' })
      .order('started_at', { ascending: false })
      .range(from, to);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    const total = count ?? 0;
    const response: PaginatedResponse<SyncLog> = {
      data: data ?? [],
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return Response.json(response);
  } catch (err) {
    console.error('GET /api/sync/logs error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
