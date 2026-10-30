import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth';
import { CATEGORIES } from '@/types';
import { slugify } from '@/lib/utils';

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data && data.length > 0) {
      return Response.json(data);
    }
  } catch (err) {
    console.warn('GET /api/categories fallback:', err);
  }

  // Fallback default categories
  const fallback = CATEGORIES.map((cat, idx) => ({
    id: `cat-${idx}`,
    name: cat,
    slug: slugify(cat),
  }));

  return Response.json(fallback);
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('categories')
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
