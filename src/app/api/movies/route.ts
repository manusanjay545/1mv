import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';
import { SAMPLE_MOVIES } from '@/lib/seed-data';
import type { Movie, PaginatedResponse, MovieFilters } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters: MovieFilters = {
    search: searchParams.get('search') || undefined,
    language: searchParams.get('language') || undefined,
    year: searchParams.get('year') ? Number(searchParams.get('year')) : undefined,
    genre: searchParams.get('genre') || undefined,
    category: searchParams.get('category') || undefined,
    sort: (searchParams.get('sort') as MovieFilters['sort']) || 'newest',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 24,
    isWebSeries: searchParams.has('isWebSeries')
      ? searchParams.get('isWebSeries') === 'true'
      : undefined,
  };

  const page = filters.page || 1;
  const pageSize = filters.pageSize || 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = createAdminClient();
    let query = supabase.from('movies').select('*', { count: 'exact' });

    // Full-text / keyword search on title
    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    // Filters
    if (filters.language) {
      query = query.eq('language', filters.language);
    }
    if (filters.year) {
      query = query.eq('release_year', filters.year);
    }
    if (filters.genre) {
      query = query.contains('genre', [filters.genre]);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.isWebSeries !== undefined) {
      query = query.eq('is_web_series', filters.isWebSeries);
    }

    // Sorting
    switch (filters.sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'popular':
        query = query.order('view_count', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (!error && data && data.length > 0) {
      const total = count ?? data.length;
      return Response.json({
        data: data as Movie[],
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    }
  } catch (err) {
    console.warn('Supabase query failed, serving filtered seed catalogue:', err);
  }

  // Graceful fallback from SAMPLE_MOVIES for immediate browsing
  let filtered = SAMPLE_MOVIES.map((m, index) => ({
    id: `seed-${index}`,
    source_id: `seed-${index}`,
    title: m.title,
    slug: slugify(m.title),
    description: m.description,
    poster_url: m.poster_url,
    release_year: m.release_year,
    language: m.language,
    genre: m.genre,
    category: m.category,
    source_url: null,
    quality: m.quality,
    file_size: m.file_size,
    published_at: new Date(Date.now() - index * 3600000).toISOString(),
    created_at: new Date(Date.now() - index * 3600000).toISOString(),
    updated_at: new Date(Date.now() - index * 3600000).toISOString(),
    last_synced_at: new Date().toISOString(),
    view_count: m.view_count,
    is_web_series: m.is_web_series,
  }));

  if (filters.search) {
    const s = filters.search.toLowerCase();
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(s) ||
        m.genre?.some((g) => g.toLowerCase().includes(s)) ||
        m.language?.toLowerCase().includes(s)
    );
  }

  if (filters.language) {
    filtered = filtered.filter((m) => m.language === filters.language);
  }

  if (filters.year) {
    filtered = filtered.filter((m) => m.release_year === filters.year);
  }

  if (filters.genre) {
    filtered = filtered.filter((m) => m.genre?.includes(filters.genre!));
  }

  if (filters.category) {
    filtered = filtered.filter((m) => m.category === filters.category);
  }

  if (filters.isWebSeries !== undefined) {
    filtered = filtered.filter((m) => m.is_web_series === filters.isWebSeries);
  }

  if (filters.sort === 'popular') {
    filtered.sort((a, b) => b.view_count - a.view_count);
  } else if (filters.sort === 'oldest') {
    filtered.sort((a, b) => (a.release_year || 0) - (b.release_year || 0));
  }

  const total = filtered.length;
  const paged = filtered.slice(from, to + 1);

  return Response.json({
    data: paged,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createAdminClient();

    if (!body.slug && body.title) {
      body.slug = slugify(body.title);
    }

    const { data, error } = await supabase
      .from('movies')
      .insert(body)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(data, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal error';
    return Response.json({ error: msg }, { status: 500 });
  }
}
