import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createAdminClient();

    // Fetch movie by slug
    const { data: movie, error } = await supabase
      .from('movies')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !movie) {
      return Response.json({ error: 'Movie not found' }, { status: 404 });
    }

    // Increment view_count (fire-and-forget)
    supabase
      .from('movies')
      .update({ view_count: movie.view_count + 1 })
      .eq('id', movie.id)
      .then();

    // Fetch destinations for this movie
    const { data: destinations } = await supabase
      .from('destinations')
      .select('*')
      .eq('movie_id', movie.id)
      .order('created_at', { ascending: true });

    return Response.json({ ...movie, destinations: destinations ?? [] });
  } catch (err) {
    console.error('GET /api/movies/[slug] error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('movies')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    if (!data) {
      return Response.json({ error: 'Movie not found' }, { status: 404 });
    }

    return Response.json(data);
  } catch (err) {
    console.error('PUT /api/movies/[slug] error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('slug', slug);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/movies/[slug] error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
