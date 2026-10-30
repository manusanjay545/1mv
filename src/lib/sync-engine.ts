import { createAdminClient } from '../lib/supabase';
import { slugify } from '../lib/utils';
import { config } from '../lib/config';
import type { SyncResult } from '../types';

// ---------------------------------------------------------------------------
// Types for intermediate data
// ---------------------------------------------------------------------------

interface ParsedMovie {
  source_id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  release_year: number | null;
  language: string | null;
  genre: string[] | null;
  category: string | null;
  source_url: string | null;
  quality: string | null;
  published_at: string | null;
  is_web_series: boolean;
}

// ---------------------------------------------------------------------------
// Helpers – metadata extraction from RSS titles
// ---------------------------------------------------------------------------

const LANGUAGE_HINTS: Record<string, RegExp> = {
  Tamil: /\btamil\b/i,
  Telugu: /\btelugu\b/i,
  Malayalam: /\bmalayalam\b/i,
  Kannada: /\bkannada\b/i,
  Hindi: /\bhindi\b/i,
  English: /\benglish\b/i,
  Bengali: /\bbengali\b/i,
  Marathi: /\bmarathi\b/i,
  Punjabi: /\bpunjabi\b/i,
  Korean: /\bkorean\b/i,
  Japanese: /\bjapanese\b/i,
  Multi: /\b(dual\s*audio|multi)\b/i,
};

const QUALITY_PATTERN = /\b(480p|720p|1080p|2160p|4k|hdrip|webrip|bluray|dvdrip|hdcam|web-?dl)\b/i;
const YEAR_PATTERN = /\b(19\d{2}|20\d{2})\b/;
const WEB_SERIES_PATTERN = /\b(s\d{1,2}|season\s*\d|episode|web\s*series)\b/i;

function extractLanguage(text: string): string | null {
  for (const [lang, re] of Object.entries(LANGUAGE_HINTS)) {
    if (re.test(text)) return lang;
  }
  return null;
}

function extractYear(text: string): number | null {
  const m = text.match(YEAR_PATTERN);
  if (!m) return null;
  const y = parseInt(m[1], 10);
  return y >= 1900 && y <= new Date().getFullYear() + 2 ? y : null;
}

function extractQuality(text: string): string | null {
  const m = text.match(QUALITY_PATTERN);
  return m ? m[1] : null;
}

function isWebSeries(text: string): boolean {
  return WEB_SERIES_PATTERN.test(text);
}

// ---------------------------------------------------------------------------
// Fetch with retry + timeout
// ---------------------------------------------------------------------------

async function fetchWithRetry(
  url: string,
  opts: RequestInit = {},
  retries = config.sync.maxRetries,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.sync.timeout);

      const res = await fetch(url, { ...opts, signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Don't retry on non-network errors (4xx etc.)
      if (lastError.message.startsWith('HTTP 4')) throw lastError;

      if (attempt < retries - 1) {
        const delay = Math.min(1000 * 2 ** attempt, 8000);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError ?? new Error('Fetch failed after retries');
}

// ---------------------------------------------------------------------------
// Source parsers
// ---------------------------------------------------------------------------

async function fetchFromRSS(feedUrl: string, authCredentials: string | null): Promise<ParsedMovie[]> {
  // Dynamic import so the module is only loaded when needed
  const Parser = (await import('rss-parser')).default;
  const parser = new Parser({
    timeout: config.sync.timeout,
    headers: authCredentials
      ? { Authorization: authCredentials }
      : undefined,
  });

  const feed = await parser.parseURL(feedUrl);
  const movies: ParsedMovie[] = [];

  for (const item of feed.items ?? []) {
    if (!item.title) continue;

    const title = item.title.trim();
    const combined = `${title} ${item.contentSnippet ?? item.content ?? ''}`;

    movies.push({
      source_id: item.guid || item.link || title,
      title,
      description: item.contentSnippet ?? item.content ?? item.summary ?? null,
      poster_url: item.enclosure?.url ?? null,
      release_year: extractYear(combined),
      language: extractLanguage(combined),
      genre: item.categories?.length ? item.categories : null,
      category: isWebSeries(combined) ? 'Web Series' : 'Movie',
      source_url: item.link ?? null,
      quality: extractQuality(combined),
      published_at: item.isoDate ?? item.pubDate ?? null,
      is_web_series: isWebSeries(combined),
    });
  }

  return movies;
}

async function fetchFromJSON(sourceUrl: string, authCredentials: string | null): Promise<ParsedMovie[]> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authCredentials) headers['Authorization'] = authCredentials;

  const res = await fetchWithRetry(sourceUrl, { headers });
  const data: unknown = await res.json();

  if (!Array.isArray(data)) {
    throw new Error('JSON source did not return an array');
  }

  return (data as Record<string, unknown>[]).map((item) => ({
    source_id: String(item.source_id ?? item.title ?? ''),
    title: String(item.title ?? ''),
    description: item.description ? String(item.description) : null,
    poster_url: item.poster_url ? String(item.poster_url) : null,
    release_year: item.release_year ? Number(item.release_year) : null,
    language: item.language ? String(item.language) : null,
    genre: Array.isArray(item.genre) ? item.genre.map(String) : item.genre ? [String(item.genre)] : null,
    category: item.category ? String(item.category) : 'Movie',
    source_url: item.source_url ? String(item.source_url) : null,
    quality: null,
    published_at: item.published_at ? String(item.published_at) : null,
    is_web_series: item.category === 'Web Series',
  }));
}

// ---------------------------------------------------------------------------
// Slug uniqueness helper
// ---------------------------------------------------------------------------

async function ensureUniqueSlug(
  supabase: ReturnType<typeof createAdminClient>,
  baseSlug: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data } = await supabase
      .from('movies')
      .select('id')
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    if (!data) return slug;

    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}

// ---------------------------------------------------------------------------
// Detect if a movie record has meaningful changes
// ---------------------------------------------------------------------------

function hasChanges(existing: Record<string, unknown>, incoming: ParsedMovie): boolean {
  const fields: (keyof ParsedMovie)[] = [
    'title',
    'description',
    'poster_url',
    'release_year',
    'language',
    'category',
    'source_url',
    'quality',
    'published_at',
    'is_web_series',
  ];

  for (const f of fields) {
    const oldVal = existing[f];
    const newVal = incoming[f];

    // Compare arrays (genre) by JSON stringification
    if (f === 'genre') {
      if (JSON.stringify(existing['genre']) !== JSON.stringify(incoming.genre)) {
        return true;
      }
      continue;
    }

    if (oldVal !== newVal) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Main sync entry point
// ---------------------------------------------------------------------------

export async function runSync(): Promise<SyncResult> {
  const supabase = createAdminClient();

  // 1. Read sync settings
  const { data: settings, error: settingsErr } = await supabase
    .from('sync_settings')
    .select('*')
    .eq('is_enabled', true)
    .limit(1)
    .maybeSingle();

  if (settingsErr) {
    return {
      status: 'failed',
      newRecords: 0,
      updatedRecords: 0,
      skippedRecords: 0,
      errorMessage: `Failed to read sync_settings: ${settingsErr.message}`,
    };
  }

  if (!settings) {
    return {
      status: 'failed',
      newRecords: 0,
      updatedRecords: 0,
      skippedRecords: 0,
      errorMessage: 'No enabled sync source configured',
    };
  }

  const { feed_url, source_url, auth_credentials, sync_interval_minutes } = settings;

  if (!feed_url && !source_url) {
    return {
      status: 'failed',
      newRecords: 0,
      updatedRecords: 0,
      skippedRecords: 0,
      errorMessage: 'Sync settings exist but neither feed_url nor source_url is configured',
    };
  }

  // 2. Create sync_log entry
  const { data: logEntry, error: logErr } = await supabase
    .from('sync_logs')
    .insert({
      status: 'running',
      started_at: new Date().toISOString(),
      new_records: 0,
      updated_records: 0,
      skipped_records: 0,
    })
    .select('id')
    .single();

  if (logErr || !logEntry) {
    return {
      status: 'failed',
      newRecords: 0,
      updatedRecords: 0,
      skippedRecords: 0,
      errorMessage: `Failed to create sync_log: ${logErr?.message ?? 'unknown'}`,
    };
  }

  const syncLogId: string = logEntry.id;
  let newRecords = 0;
  let updatedRecords = 0;
  let skippedRecords = 0;

  try {
    // 3. Fetch content from source
    let movies: ParsedMovie[];

    if (feed_url) {
      movies = await fetchFromRSS(feed_url, auth_credentials);
    } else {
      movies = await fetchFromJSON(source_url!, auth_credentials);
    }

    if (movies.length === 0) {
      // Nothing to process — mark as success with zero counts
      await finalizeSyncLog(supabase, syncLogId, 'success', 0, 0, 0);
      await updateSyncTimestamps(supabase, settings.id, sync_interval_minutes);
      return { status: 'success', newRecords: 0, updatedRecords: 0, skippedRecords: 0 };
    }

    // 4. Upsert each movie
    for (const movie of movies) {
      try {
        if (!movie.title || !movie.source_id) {
          skippedRecords++;
          continue;
        }

        // Check for existing record by source_id
        const { data: existing } = await supabase
          .from('movies')
          .select('*')
          .eq('source_id', movie.source_id)
          .limit(1)
          .maybeSingle();

        if (existing) {
          // Existing record — update only if changed
          if (hasChanges(existing, movie)) {
            const { error: updateErr } = await supabase
              .from('movies')
              .update({
                title: movie.title,
                description: movie.description,
                poster_url: movie.poster_url,
                release_year: movie.release_year,
                language: movie.language,
                genre: movie.genre,
                category: movie.category,
                source_url: movie.source_url,
                quality: movie.quality,
                published_at: movie.published_at,
                is_web_series: movie.is_web_series,
                last_synced_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('id', existing.id);

            if (updateErr) {
              console.error(`Failed to update movie ${movie.source_id}: ${updateErr.message}`);
              skippedRecords++;
            } else {
              updatedRecords++;
            }
          } else {
            // Touch last_synced_at even if nothing changed
            await supabase
              .from('movies')
              .update({ last_synced_at: new Date().toISOString() })
              .eq('id', existing.id);
            skippedRecords++;
          }
        } else {
          // New record
          const baseSlug = slugify(movie.title);
          const slug = await ensureUniqueSlug(supabase, baseSlug);

          const { error: insertErr } = await supabase.from('movies').insert({
            source_id: movie.source_id,
            title: movie.title,
            slug,
            description: movie.description,
            poster_url: movie.poster_url,
            release_year: movie.release_year,
            language: movie.language,
            genre: movie.genre,
            category: movie.category,
            source_url: movie.source_url,
            quality: movie.quality,
            published_at: movie.published_at,
            is_web_series: movie.is_web_series,
            last_synced_at: new Date().toISOString(),
          });

          if (insertErr) {
            console.error(`Failed to insert movie ${movie.source_id}: ${insertErr.message}`);
            skippedRecords++;
          } else {
            newRecords++;
          }
        }
      } catch (itemErr) {
        // Gracefully handle individual item errors
        console.error(`Error processing movie "${movie.title}":`, itemErr);
        skippedRecords++;
      }
    }

    // 5. Determine final status
    const status: SyncResult['status'] =
      newRecords === 0 && updatedRecords === 0 && skippedRecords > 0
        ? 'partial'
        : 'success';

    // 6. Finalize
    await finalizeSyncLog(supabase, syncLogId, status, newRecords, updatedRecords, skippedRecords);
    await updateSyncTimestamps(supabase, settings.id, sync_interval_minutes);

    return { status, newRecords, updatedRecords, skippedRecords };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('Sync engine error:', errorMessage);

    await finalizeSyncLog(supabase, syncLogId, 'failed', newRecords, updatedRecords, skippedRecords, errorMessage);

    return {
      status: 'failed',
      newRecords,
      updatedRecords,
      skippedRecords,
      errorMessage,
    };
  }
}

// ---------------------------------------------------------------------------
// Helpers – DB updates
// ---------------------------------------------------------------------------

async function finalizeSyncLog(
  supabase: ReturnType<typeof createAdminClient>,
  logId: string,
  status: string,
  newRecords: number,
  updatedRecords: number,
  skippedRecords: number,
  errorMessage?: string,
) {
  await supabase
    .from('sync_logs')
    .update({
      status,
      completed_at: new Date().toISOString(),
      new_records: newRecords,
      updated_records: updatedRecords,
      skipped_records: skippedRecords,
      error_message: errorMessage ?? null,
    })
    .eq('id', logId);
}

async function updateSyncTimestamps(
  supabase: ReturnType<typeof createAdminClient>,
  settingsId: string,
  intervalMinutes: number,
) {
  const now = new Date();
  const nextSync = new Date(now.getTime() + intervalMinutes * 60_000);

  await supabase
    .from('sync_settings')
    .update({
      last_sync_at: now.toISOString(),
      next_sync_at: nextSync.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('id', settingsId);
}
