import { NextResponse } from 'next/server'
import { crawlBugsIndieAlbums } from '@/lib/crawlers/bugs'
import { createServiceClient, slugify } from '@/lib/crawlers/utils'

export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('Authorization')
    const expected = `Bearer ${cronSecret}`
    if (auth !== expected) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabase = createServiceClient()
  let recordsUpserted = 0

  try {
    const albums = await crawlBugsIndieAlbums()

    const uniqueArtistRows = Array.from(
      new Map(
        albums.map((a) => {
          const slug = slugify('', a.artist)
          return [slug, { name: a.artist, slug }]
        })
      ).values()
    )

    const { data: artistData, error: artistErr } = await supabase
      .from('artists')
      .upsert(uniqueArtistRows, { onConflict: 'slug' })
      .select('id, slug')

    if (artistErr) {
      throw new Error(`Artist upsert failed: ${artistErr.message}`)
    }

    const artistSlugToId: Record<string, string> = {}
    for (const row of artistData ?? []) {
      artistSlugToId[row.slug] = row.id
    }

    const releaseRows = albums.map((album) => ({
      title: album.title,
      release_date: album.release_date,
      label: null,
      genres: [] as string[],
      cover_image_url: album.cover_image_url,
      source_type: 'domestic_indie' as const,
      status: 'released' as const,
      metacritic_score: null,
      aoty_score: null,
      source_url: album.source_url,
      slug: album.slug,
    }))

    const { data: releaseData, error: releaseErr } = await supabase
      .from('releases')
      .upsert(releaseRows, { onConflict: 'slug' })
      .select('id, slug')

    if (releaseErr) {
      throw new Error(`Release upsert failed: ${releaseErr.message}`)
    }

    const releaseSlugToId: Record<string, string> = {}
    for (const row of releaseData ?? []) {
      releaseSlugToId[row.slug] = row.id
    }

    const junctionRows = albums
      .map((album) => ({
        release_id: releaseSlugToId[album.slug],
        artist_id: artistSlugToId[slugify('', album.artist)],
      }))
      .filter((j) => j.release_id !== undefined && j.artist_id !== undefined)

    await supabase.from('release_artists').upsert(junctionRows, {
      onConflict: 'release_id,artist_id',
      ignoreDuplicates: true,
    })

    recordsUpserted = albums.length

    await supabase.from('crawl_logs').insert({
      source: 'bugs_indie',
      status: 'success',
      records_upserted: recordsUpserted,
    })

    return NextResponse.json({ success: true, count: recordsUpserted })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await supabase.from('crawl_logs').insert({
      source: 'bugs_indie',
      status: 'failed',
      records_upserted: recordsUpserted,
      error_message: message,
    })
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
