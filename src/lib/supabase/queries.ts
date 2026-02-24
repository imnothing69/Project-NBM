import { createClient } from '@supabase/supabase-js'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export type RecentRelease = {
  title: string
  artist: string
  date: string
  coverUrl: string
}

function mapRow(row: {
  title: string
  release_date: string
  cover_image_url: string | null
  release_artists?: Array<{ artists: { name: string } | null } | null>
}): RecentRelease {
  const artist = row.release_artists?.[0]?.artists?.name ?? 'Unknown'
  const date = row.release_date.replace(/-/g, '.')
  const coverUrl = row.cover_image_url ?? ''
  return { title: row.title, artist, date, coverUrl }
}

export async function getRecentDomesticReleases(limit = 3): Promise<RecentRelease[]> {
  try {
    const supabase = getClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('releases')
      .select(
        `
        title,
        release_date,
        cover_image_url,
        slug,
        release_artists (
          artists ( name )
        )
      `
      )
      .eq('source_type', 'domestic_indie')
      .eq('status', 'released')
      .order('release_date', { ascending: false })
      .limit(limit)

    if (error) return []
    return (data ?? []).map(mapRow)
  } catch {
    return []
  }
}

export async function getRecentGlobalReleases(limit = 3): Promise<RecentRelease[]> {
  try {
    const supabase = getClient()
    if (!supabase) return []

    const { data, error } = await supabase
      .from('releases')
      .select(
        `
        title,
        release_date,
        cover_image_url,
        slug,
        release_artists (
          artists ( name, origin_country )
        )
      `
      )
      .eq('source_type', 'global')
      .eq('status', 'released')
      .order('release_date', { ascending: false })
      .limit(limit * 5)

    if (error) return []
    return (data ?? [])
      .filter(
        (row) => row.release_artists?.[0]?.artists?.origin_country !== 'KR'
      )
      .slice(0, limit)
      .map(mapRow)
  } catch {
    return []
  }
}
