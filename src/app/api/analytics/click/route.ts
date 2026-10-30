import { type NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const { movieId, destinationId, referrer, originalUrl } = body as {
      movieId?: string;
      destinationId?: string;
      referrer?: string;
      originalUrl?: string;
    };

    let shrinkmeUrl = config.shrinkme.url;
    let monetizationEnabled = true;

    try {
      const supabase = createAdminClient();

      // Record the click in analytics
      await supabase.from('click_analytics').insert({
        movie_id: movieId || null,
        destination_id: destinationId || null,
        referrer: referrer || null,
        user_agent: request.headers.get('user-agent') || null,
      });

      // Fetch dynamic settings if available
      const { data: settings } = await supabase
        .from('site_settings')
        .select('shrinkme_url, monetization_enabled')
        .limit(1)
        .maybeSingle();

      if (settings) {
        if (settings.shrinkme_url) {
          shrinkmeUrl = settings.shrinkme_url;
        }
        if (typeof settings.monetization_enabled === 'boolean') {
          monetizationEnabled = settings.monetization_enabled;
        }
      }
    } catch (dbErr) {
      console.warn('Click tracking fallback (DB optional):', dbErr);
    }

    // Determine the actual redirect target
    // If monetization is enabled: MUST return the fixed ShrinkMe URL: https://shrinkme.click/OXfgZ7I
    // If monetization is explicitly disabled by admin: return the originalUrl (if provided) or fallback
    const targetUrl = monetizationEnabled ? shrinkmeUrl : (originalUrl || shrinkmeUrl);

    return Response.json({
      success: true,
      shrinkmeUrl: targetUrl,
      monetizationEnabled,
    });
  } catch (err) {
    console.error('POST /api/analytics/click error:', err);
    return Response.json({
      success: true,
      shrinkmeUrl: config.shrinkme.url,
      monetizationEnabled: true,
    });
  }
}
