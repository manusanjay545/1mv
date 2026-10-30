# MovieVault — Automated Movie Catalogue with ShrinkMe Monetization

A complete, production-ready movie and web series catalogue web application inspired by dark directory browsing layouts (like 1TamilMV). Features automatic 15-minute scheduled synchronization, Supabase PostgreSQL persistence, full admin dashboard, search and category filtering, and mandatory **ShrinkMe.io** advertising monetization on all download buttons.

---

## 🌟 Key Features

- **Dark-Themed Catalogue Design**: Polished, responsive dark UI using Tailwind CSS, featuring rich posters, badges (Language, Quality, Category), and smooth hover interactions.
- **Fixed ShrinkMe Monetization**:
  - Exact target configured: `https://shrinkme.click/OXfgZ7I`
  - Centralized server-side configuration ensuring every single download button (movie detail, web series, mirrors) redirects visitors through ShrinkMe advertising.
  - Outbound download click tracking with referrer and user-agent analytics.
- **Automatic Content Synchronization**:
  - Vercel Cron triggers the sync endpoint every 15 minutes (`*/15 * * * *`).
  - Supports both **RSS Feeds** (using `rss-parser`) and **JSON REST APIs**.
  - Intelligent metadata extraction: auto-detects language, release year, resolution (4K, 1080p, 720p, HDRip), genres, and web series flags.
  - Prevents duplicates via unique slug and `source_id` indexing.
  - Robust error handling: retries with exponential backoff, detailed sync logs, and fail-safe preservation of existing database records if sources are offline.
- **Admin Management Console (`/admin`)**:
  - Overview metrics: total titles, daily additions, outbound click counters, and sync pipeline health.
  - Movie Catalogue management: create, edit, delete, and add multiple download mirrors.
  - Sync controls: configure RSS/API URLs, auth headers, sync cadence, and trigger manual sync with 1-click.
  - Monetization controls: inspect ShrinkMe link, toggle monetization globally, and test download redirects.
  - Click Analytics: view real-time outbound download conversions and top performing titles.
- **High-Performance Search & Filtering (`/browse`)**:
  - Filter by Language (Tamil, Telugu, Malayalam, Kannada, Hindi, English, etc.).
  - Filter by Genre, Release Year, and Category (Movie, Web Series).
  - Sort by Newest, Oldest, or Most Popular.
  - Responsive pagination and search bar with keyword matching.
- **SEO & Production Optimized**:
  - Next.js App Router with server-rendered pages for optimal crawlability.
  - Dynamic Open Graph metadata for rich social sharing.
  - Auto-generated `sitemap.xml` and `robots.txt`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Lucide React Icons |
| **Database** | Supabase (PostgreSQL with RLS) |
| **Auth** | Supabase Auth |
| **Automation** | Vercel Cron Jobs (`vercel.json`) |
| **Monetization** | ShrinkMe.io (`https://shrinkme.click/OXfgZ7I`) |
| **Deployment** | Vercel Serverless Platform |

---

## 📋 Environment Variables

Create a `.env.local` file in the root directory (refer to `.env.example`):

```bash
# Supabase Database & Auth (From your Supabase Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Vercel Cron Security Secret
CRON_SECRET=your-secure-cron-secret-token

# ShrinkMe Monetization (Mandatory Fixed Link)
SHRINKME_URL=https://shrinkme.click/OXfgZ7I

# Default Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123

# Site Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=MovieVault
```

---

## 🗄️ Supabase Database Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire contents of `supabase/schema.sql`.
   This script creates:
   - `movies`: stores movie metadata, quality, file size, view count, language, and slug.
   - `destinations`: authorized download mirrors and prints linked to each movie.
   - `categories`: catalogue taxonomy.
   - `sync_settings`: configuration for the 15-minute automatic sync engine.
   - `sync_logs`: execution history, counts of new/updated/skipped records, and errors.
   - `click_analytics`: records outbound download clicks for monetization stats.
   - `site_settings`: dynamic settings for the ShrinkMe URL and global monetization toggle.
   - Row Level Security (RLS) policies and automated `updated_at` triggers.
4. Copy your **Project URL**, **Anon Key**, and **Service Role Key** into `.env.local` and your Vercel Environment Variables.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Or build and test production bundle
npm run build
npm run start
```

Visit:
- Catalogue: `http://localhost:3000`
- Search & Filters: `http://localhost:3000/browse`
- Movie Details: `http://localhost:3000/movie/vikram-vedha-the-dark-chronicle`
- Admin Dashboard: `http://localhost:3000/admin` (Sign in with `admin@example.com` / `changeme123`)

---

## ⚡ Automated 15-Minute Synchronization

The synchronization engine is scheduled via `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/synchronize",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

### How the Workflow Operates:
1. Every 15 minutes, Vercel Cron calls `GET /api/cron/synchronize` with `Authorization: Bearer <CRON_SECRET>`.
2. The endpoint verifies `CRON_SECRET` and checks if synchronization is enabled in `sync_settings`.
3. The engine fetches entries from the configured RSS feed or JSON API.
4. Entries are parsed and sanitized (extracting title, language hints, quality tags, year).
5. Compares against existing database records using unique slugs and `source_id`.
6. New titles are inserted; changed metadata is updated; existing unchanged records are skipped.
7. Logs are recorded in `sync_logs` with complete diagnostic metrics.
8. If the source is temporarily unreachable, existing catalogue records remain intact and the error is logged.

> **Note on Vercel Plans**: Vercel Hobby accounts support 1 cron job per day. On Vercel Pro, 15-minute crons are natively supported. If deploying on Hobby, you can use a free external cron service such as [cron-job.org](https://cron-job.org) or [Upstash QStash] to ping `https://your-domain.com/api/cron/synchronize` every 15 minutes with the `Authorization: Bearer <CRON_SECRET>` header.

---

## 💰 ShrinkMe.io Monetization Integration

Whenever a visitor clicks **Download** on any movie card, detail page, or episode mirror:

1. A `POST` request is sent to `/api/analytics/click`.
2. The click event is logged in `click_analytics`.
3. The server provides the configured URL:
   `https://shrinkme.click/OXfgZ7I`
4. The client opens the link in a new tab: `window.open(url, '_blank')`.
5. The visitor passes through the ShrinkMe monetization flow before landing on the authorized destination.
6. A clear notice is displayed beneath the button stating that the link is supported by advertising.

---

## 🔒 Security Best Practices

- **Service Role Key Isolation**: Never exposed to the browser; used strictly in server-side API routes and cron jobs.
- **Row Level Security (RLS)**: Public visitors can only view content and insert click tracking records; write and delete access is restricted to authenticated admin sessions.
- **CRON Secret Protection**: The `/api/cron/synchronize` route enforces Bearer authentication to prevent unauthorized execution.
- **Open Redirect Protection**: Centralized URL management prevents malicious arbitrary redirects.
- **Legal & Redistribution Notice**: Only authorized public metadata and distribution links should be added. No copyrighted video content is hosted directly.

---

## 📦 Deployment to Vercel

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete MovieVault catalogue with ShrinkMe monetization"
   git push origin main
   ```
2. Log into [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`
   - `SHRINKME_URL` (`https://shrinkme.click/OXfgZ7I`)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_SITE_URL`
5. Click **Deploy**. Vercel will automatically build the Next.js app and register the 15-minute cron job defined in `vercel.json`.
