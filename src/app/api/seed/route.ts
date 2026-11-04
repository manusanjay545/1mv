import { type NextRequest } from 'next/server';
import { seedDemoData } from '@/lib/seed-data';
import { getAuthUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // If auth is provided, verify admin; in development or setup, allow easy seeding
    const authHeader = request.headers.get('Authorization');
    if (process.env.NODE_ENV === 'production' && !authHeader) {
      const user = await getAuthUser(request);
      if (!user) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const result = await seedDemoData();
    return Response.json({
      message: `Seeding completed. ${result.inserted} new movies inserted.`,
      result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}

