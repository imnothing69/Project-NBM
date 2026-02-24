import { crawlAotyReleased, crawlAotyUpcoming } from '../src/lib/crawlers/aoty'
import { createServiceClient, slugify } from '../src/lib/crawlers/utils'

async function main() {
  const supabase = createServiceClient()
  let recordsUpserted = 0

  try {
    console.log('Crawling AOTY...')
    const released = await crawlAotyReleased()
    await new Promise((r) => setTimeout(r, 2000))
    let upcoming: Awaited<ReturnType<typeof crawlAotyUpcoming>> = []
    try {
      upcoming = await crawlAotyUpcoming()
    } catch (e) {
      console.warn('Upcoming crawl failed (may be rate-limited), continuing with released only:', e instanceof Error ? e.message : e)
    }
    const albums = [...released, ...upcoming]
    console.log(`Found ${albums.length} albums (${released.length} released, ${upcoming.length} upcoming)`)

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

    const releaseRows = Array.from(
      new Map(
        albums.map((album) => [
          album.slug,
          {
            title: album.title,
            release_date: album.release_date,
            label: null,
            genres: [] as string[],
            cover_image_url: album.cover_image_url,
            source_type: 'global' as const,
            status: album.status,
            metacritic_score: null,
            aoty_score: album.aoty_score,
            source_url: album.source_url,
            slug: album.slug,
          },
        ])
      ).values()
    )

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
    console.log('Upserted artists, releases, junctions')

    await supabase.from('crawl_logs').insert({
      source: 'aoty_global',
      status: 'success',
      records_upserted: recordsUpserted,
    })

    console.log(`Done. ${recordsUpserted} records upserted.`)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    await supabase.from('crawl_logs').insert({
      source: 'aoty_global',
      status: 'failed',
      records_upserted: recordsUpserted,
      error_message: message,
    })
    console.error(message)
    process.exit(1)
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
