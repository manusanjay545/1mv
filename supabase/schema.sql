-- MovieVault Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default categories
INSERT INTO categories (name, slug) VALUES
  ('Movie', 'movie'),
  ('Web Series', 'web-series'),
  ('TV Show', 'tv-show'),
  ('Documentary', 'documentary'),
  ('Short Film', 'short-film'),
  ('Anime', 'anime')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- MOVIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id TEXT UNIQUE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  poster_url TEXT,
  release_year INTEGER,
  language TEXT,
  genre TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Movie',
  source_url TEXT,
  quality TEXT,
  file_size TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_web_series BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indexes for movies
CREATE INDEX IF NOT EXISTS idx_movies_language ON movies (language);
CREATE INDEX IF NOT EXISTS idx_movies_release_year ON movies (release_year);
CREATE INDEX IF NOT EXISTS idx_movies_category ON movies (category);
CREATE INDEX IF NOT EXISTS idx_movies_published_at ON movies (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_movies_created_at ON movies (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_movies_view_count ON movies (view_count DESC);
CREATE INDEX IF NOT EXISTS idx_movies_is_web_series ON movies (is_web_series);
CREATE INDEX IF NOT EXISTS idx_movies_slug ON movies (slug);
CREATE INDEX IF NOT EXISTS idx_movies_source_id ON movies (source_id);
CREATE INDEX IF NOT EXISTS idx_movies_title_search ON movies USING gin (to_tsvector('english', title));

-- ============================================================
-- DESTINATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  label TEXT,
  original_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_destinations_movie_id ON destinations (movie_id);

-- ============================================================
-- SYNC SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS sync_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_name TEXT NOT NULL DEFAULT 'Default Source',
  source_url TEXT,
  feed_url TEXT,
  auth_credentials TEXT,
  sync_interval_minutes INTEGER NOT NULL DEFAULT 15,
  is_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default sync settings
INSERT INTO sync_settings (source_name, sync_interval_minutes, is_enabled)
VALUES ('Default Source', 15, false)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SYNC LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed', 'partial')),
  new_records INTEGER NOT NULL DEFAULT 0,
  updated_records INTEGER NOT NULL DEFAULT 0,
  skipped_records INTEGER NOT NULL DEFAULT 0,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_started_at ON sync_logs (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs (status);

-- ============================================================
-- CLICK ANALYTICS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS click_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  movie_id UUID REFERENCES movies(id) ON DELETE SET NULL,
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  referrer TEXT,
  country TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_click_analytics_movie_id ON click_analytics (movie_id);
CREATE INDEX IF NOT EXISTS idx_click_analytics_clicked_at ON click_analytics (clicked_at DESC);

-- ============================================================
-- SITE SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shrinkme_url TEXT NOT NULL DEFAULT 'https://shrinkme.click/OXfgZ7I',
  monetization_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  site_name TEXT NOT NULL DEFAULT 'MovieVault',
  site_description TEXT DEFAULT 'Your ultimate movie catalogue',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default site settings
INSERT INTO site_settings (shrinkme_url, monetization_enabled, site_name)
VALUES ('https://shrinkme.click/OXfgZ7I', true, 'MovieVault')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Movies: public read, admin write
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Movies are viewable by everyone" ON movies FOR SELECT USING (true);
CREATE POLICY "Movies are editable by authenticated users" ON movies FOR ALL USING (auth.role() = 'authenticated');

-- Destinations: public read, admin write
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Destinations are viewable by everyone" ON destinations FOR SELECT USING (true);
CREATE POLICY "Destinations are editable by authenticated users" ON destinations FOR ALL USING (auth.role() = 'authenticated');

-- Categories: public read, admin write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are editable by authenticated users" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Sync settings: admin only
ALTER TABLE sync_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sync settings are admin only" ON sync_settings FOR ALL USING (auth.role() = 'authenticated');

-- Sync logs: admin only
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sync logs are admin only" ON sync_logs FOR ALL USING (auth.role() = 'authenticated');

-- Click analytics: insert public (for tracking), read admin only
ALTER TABLE click_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Click analytics insertable by everyone" ON click_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Click analytics readable by admin" ON click_analytics FOR SELECT USING (auth.role() = 'authenticated');

-- Site settings: public read, admin write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings viewable by everyone" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Site settings editable by admin" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sync_settings_updated_at BEFORE UPDATE ON sync_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

