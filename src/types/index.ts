// Database types matching Supabase schema
export interface Movie {
  id: string;
  source_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  poster_url: string | null;
  release_year: number | null;
  language: string | null;
  genre: string[] | null;
  category: string | null;
  source_url: string | null;
  quality: string | null;
  file_size: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  last_synced_at: string | null;
  view_count: number;
  is_web_series: boolean;
}

export interface Destination {
  id: string;
  movie_id: string;
  label: string | null;
  original_url: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface SyncSettings {
  id: string;
  source_name: string;
  source_url: string | null;
  feed_url: string | null;
  auth_credentials: string | null;
  sync_interval_minutes: number;
  is_enabled: boolean;
  last_sync_at: string | null;
  next_sync_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SyncLog {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: 'running' | 'success' | 'failed' | 'partial';
  new_records: number;
  updated_records: number;
  skipped_records: number;
  error_message: string | null;
}

export interface ClickAnalytic {
  id: string;
  movie_id: string | null;
  destination_id: string | null;
  clicked_at: string;
  referrer: string | null;
  country: string | null;
  user_agent: string | null;
}

export interface SiteSettings {
  id: string;
  shrinkme_url: string;
  monetization_enabled: boolean;
  site_name: string;
  site_description: string | null;
  updated_at: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SyncResult {
  status: 'success' | 'failed' | 'partial';
  newRecords: number;
  updatedRecords: number;
  skippedRecords: number;
  errorMessage?: string;
}

export interface DashboardStats {
  totalMovies: number;
  newToday: number;
  totalClicks: number;
  totalCategories: number;
  lastSync: string | null;
  nextSync: string | null;
  failedSyncs: number;
}

// Filter types
export interface MovieFilters {
  search?: string;
  language?: string;
  year?: number;
  genre?: string;
  category?: string;
  sort?: 'newest' | 'oldest' | 'popular';
  page?: number;
  pageSize?: number;
  isWebSeries?: boolean;
}

export const LANGUAGES = [
  'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Hindi', 'English',
  'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Korean', 'Japanese',
  'Chinese', 'Spanish', 'French', 'Multi'
] as const;

export const GENRES = [
  'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
  'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller',
  'War', 'Western'
] as const;

export const CATEGORIES = [
  'Movie', 'Web Series', 'TV Show', 'Documentary', 'Short Film', 'Anime'
] as const;

export type Language = typeof LANGUAGES[number];
export type Genre = typeof GENRES[number];
export type CategoryType = typeof CATEGORIES[number];

export function getYearRange(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= 2000; y--) {
    years.push(y);
  }
  return years;
}


