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

### Vercel Plan Compatibility
* **Vercel Pro**: Supports arbitrary cron frequency (`*/15 * * * *`).
* **Vercel Hobby**: Vercel limits native cron jobs to **once per day** (`0 0 * * *`). Setting `*/15 * * * *` will trigger a deployment block.

To provide seamless 15-minute synchronization on **both** free Hobby accounts and Pro accounts:

1. **Native Vercel Cron (`vercel.json`)**:
   Configured to `0 0 * * *` (once daily at midnight) so that Vercel Hobby accounts deploy without errors. (If you are on Vercel Pro, you can change this to `*/15 * * * *`).

2. **Free 15-Minute GitHub Actions Runner (`.github/workflows/sync-cron.yml`)**:
   An automated workflow runs every 15 minutes directly from your GitHub repository for free:
   - Go to your GitHub repository -> **Settings** -> **Secrets and variables** -> **Actions**.
   - Add two secrets:
     - `SITE_URL`: `https://your-app.vercel.app`
     - `CRON_SECRET`: Your secret matching the one in Vercel environment variables.
   - GitHub Actions will ping `https://your-app.vercel.app/api/cron/synchronize` every 15 minutes automatically.

3. **Alternative External Cron Schedulers**:
   You can also use free services like [cron-job.org](https://cron-job.org) or [Upstash QStash] to send a `GET` request to `https://your-app.vercel.app/api/cron/synchronize` every 15 minutes with header:
   ```http
   Authorization: Bearer <your-cron-secret>
   ```

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
