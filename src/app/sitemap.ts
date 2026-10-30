import { MetadataRoute } from 'next';
import { SAMPLE_MOVIES } from '@/lib/seed-data';
import { slugify } from '@/lib/utils';
import { createAdminClient } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://movievault.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/browse?category=Web+Series`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  let movieSlugs: string[] = [];

  try {
    const supabase = createAdminClient();
    const { data: movies } = await supabase.from('movies').select('slug, updated_at').limit(100);
    if (movies && movies.length > 0) {
      movieSlugs = movies.map((m) => m.slug);
    }
  } catch (err) {
    // Fallback
  }

  if (movieSlugs.length === 0) {
    movieSlugs = SAMPLE_MOVIES.map((m) => slugify(m.title));
  }

  const movieRoutes: MetadataRoute.Sitemap = movieSlugs.map((slug) => ({
    url: `${baseUrl}/movie/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return [...staticRoutes, ...movieRoutes];
}
