import { createClient } from '@supabase/supabase-js'

/**
 * Deterministic slug from artist + title.
 * e.g. slugify("Adrianne Lenker", "Bright Future") → "adrianne-lenker-bright-future"
 */
export function slugify(artist: string, title: string): string {
  const combined = `${artist} ${title}`.trim()
  const slug = combined
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  // 한글 등 비ASCII: 유니코드 문자 허용하여 fallback
  if (!slug) {
    return combined
      .replace(/[\s]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'unknown'
  }
  return slug
}

/**
 * Returns Date object for N months ago from today
 */
export function monthsAgo(n: number): Date {
  const d = new Date()
  d.setMonth(d.getMonth() - n)
  return d
}

/**
 * Supabase client using service_role key (for server-side writes).
 * Uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, key)
}
