import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const movieId = request.nextUrl.searchParams.get('movieId');

    if (!movieId) {
      return Response.json({ error: 'movieId query param is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data ?? []);
  } catch (err) {
    console.error('GET /api/destinations error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { movieId, label, originalUrl } = body as {
      movieId: string;
      label?: string;
      originalUrl: string;
    };

    if (!movieId || !originalUrl) {
      return Response.json(
        { error: 'movieId and originalUrl are required' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('destinations')
      .insert({
        movie_id: movieId,
        label: label || null,
        original_url: originalUrl,
      })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(data, { status: 201 });
  } catch (err) {
    console.error('POST /api/destinations error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return Response.json({ error: 'id query param is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/destinations error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
