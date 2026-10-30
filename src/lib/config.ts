// Centralized server-side configuration
// All sensitive values come from environment variables

export const config = {
  shrinkme: {
    url: process.env.SHRINKME_URL || 'https://shrinkme.click/OXfgZ7I',
  },
  cron: {
    secret: process.env.CRON_SECRET || '',
  },
  site: {
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'MovieVault',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    description: 'Your ultimate movie catalogue — browse, discover, and download movies across languages.',
  },
  sync: {
    defaultInterval: 15, // minutes
    maxRetries: 3,
    timeout: 25000, // ms — leave headroom under Vercel's 30s limit
  },
} as const;

