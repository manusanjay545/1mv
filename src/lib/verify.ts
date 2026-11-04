import assert from 'node:assert';
import fs from 'node:fs';
import { config } from './config';
import { SAMPLE_MOVIES } from './seed-data';

console.log('🧪 Starting MovieVault Automated Test Suite...\n');

// 1. Verify Config
console.log('✓ Checking ShrinkMe configuration:');
console.log('  Configured URL:', config.shrinkme.url);
assert.strictEqual(
  config.shrinkme.url,
  'https://shrinkme.click/OXfgZ7I',
  'ShrinkMe URL must match https://shrinkme.click/OXfgZ7I exactly'
);
console.log('  PASS: Exact ShrinkMe monetization URL verified!\n');

// 2. Verify Sample & Seed Data
console.log('✓ Checking Seed & Catalogue Data:');
console.log('  Total sample titles:', SAMPLE_MOVIES.length);
assert(SAMPLE_MOVIES.length >= 30, 'Should have at least 30 movies for catalogue seed');

const languages = new Set(SAMPLE_MOVIES.map(m => m.language));
console.log('  Languages covered:', Array.from(languages).join(', '));
assert(languages.has('Tamil'), 'Must include Tamil');
assert(languages.has('Telugu'), 'Must include Telugu');
assert(languages.has('Malayalam'), 'Must include Malayalam');
assert(languages.has('Hindi'), 'Must include Hindi');
assert(languages.has('English'), 'Must include English');

const webSeries = SAMPLE_MOVIES.filter(m => m.is_web_series);
console.log('  Web series titles:', webSeries.length);
assert(webSeries.length >= 5, 'Should have web series included');
console.log('  PASS: Movie catalogue metadata verified!\n');

// 3. Verify Vercel Cron Configuration
const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
console.log('✓ Checking vercel.json cron configuration:');
console.log('  Crons:', JSON.stringify(vercelConfig.crons, null, 2));
assert(vercelConfig.crons.length > 0, 'vercel.json must define crons');
assert.strictEqual(vercelConfig.crons[0].path, '/api/cron/synchronize');
assert(
  vercelConfig.crons[0].schedule === '0 0 * * *' || vercelConfig.crons[0].schedule === '*/15 * * * *',
  'Cron schedule must be valid'
);
console.log('  PASS: Vercel Cron configuration verified!\n');

console.log('🎉 ALL AUTOMATED VERIFICATION CHECKS PASSED!\n');

