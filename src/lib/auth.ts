import { createAdminClient } from './supabase';

/**
 * Verify the Authorization bearer token and return the authenticated user.
 * Returns null if the token is missing or invalid.
 */
export async function getAuthUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7);
  if (!token) return null;

  // Local demo / development admin token support
  if (
    token === 'demo-admin-token-movievault' ||
    (process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD)
  ) {
    return {
      id: 'admin-local-id',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      role: 'authenticated',
    };
  }

  try {
    const supabase = createAdminClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) return null;
    return user;
  } catch (err) {
    console.warn('Supabase auth check error:', err);
    return null;
  }
}
