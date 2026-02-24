import * as cheerio from 'cheerio'
import { slugify, monthsAgo } from './utils'

const AOTY_BASE = 'https://www.albumoftheyear.org'
const RELEASES_URL = `${AOTY_BASE}/releases`
const UPCOMING_URL = `${AOTY_BASE}/upcoming`
const MAX_PAGES = 5

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
}

const MONTH_ABBR: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
}

export interface AotyAlbum {
  title: string
  artist: string
  release_date: string // "YYYY-MM-DD"
  cover_image_url: string
  source_url: string
  aoty_score: number | null
  slug: string
  status: 'released' | 'upcoming'
}

function parseAotyDate(text: string, defaultYear: number): string | null {
  // "Feb 23 • LP" or "Feb 25" or "January 15, 2026"
  const shortMatch = text.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})/)
  if (shortMatch) {
    const month = MONTH_ABBR[shortMatch[1]]
    const day = parseInt(shortMatch[2], 10)
    if (month && day >= 1 && day <= 31) {
      return `${defaultYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }
  }
  const longMatch = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/)
  if (longMatch) {
    const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december']
    const month = monthNames.indexOf(longMatch[1].toLowerCase()) + 1
    const day = parseInt(longMatch[2], 10)
    const year = parseInt(longMatch[3], 10)
    if (month && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }
  }
  return null
}

function containsHangul(text: string): boolean {
  return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text)
}

const KOREAN_ARTIST_DENYLIST = new Set([
  'ive', 'aespa', 'newjeans', 'stray kids', 'txt', 'bts',
  'seventeen', 'nct', 'le sserafim', 'illit', 'kiss of life',
])

function parseReleasedPage(html: string, status: 'released'): AotyAlbum[] {
  const $ = cheerio.load(html)
  const albums: AotyAlbum[] = []
  const year = new Date().getFullYear()

  $('.albumBlock.five').each((_, el) => {
    const $block = $(el)

    const albumLink = $block.find('a[href*="/album/"]').first()
    const albumHref = albumLink.attr('href')
    if (!albumHref) return

    const title = $block.find('.albumTitle').text().trim()
    if (!title) return

    const artist = $block.find('.artistTitle').first().text().trim() || 'Unknown'

    if (containsHangul(artist) || containsHangul(title) || KOREAN_ARTIST_DENYLIST.has(artist.toLowerCase())) return

    const typeText = $block.find('.type').text().trim()
    const releaseDate = parseAotyDate(typeText, year)
    if (!releaseDate) return

    let cover_image_url = $block.find('.image img').attr('src') || ''
    if (cover_image_url.startsWith('//')) cover_image_url = `https:${cover_image_url}`
    if (!cover_image_url && $block.find('.noCover').length) {
      cover_image_url = 'https://cdn.albumoftheyear.org/images/favicon.png'
    }

    let aoty_score: number | null = null
    const $ratingContainer = $block.find('.ratingRowContainer')
    $ratingContainer.find('.ratingRow').each((_, row) => {
      const $row = $(row)
      if ($row.find('.ratingText').first().text().includes('critic score')) {
        const score = parseInt($row.find('.rating').first().text().trim(), 10)
        if (!isNaN(score)) aoty_score = score
      }
    })

    const source_url = albumHref.startsWith('http') ? albumHref : `${AOTY_BASE}${albumHref.startsWith('/') ? '' : '/'}${albumHref}`

    albums.push({
      title,
      artist,
      release_date: releaseDate,
      cover_image_url: cover_image_url || '',
      source_url,
      aoty_score,
      slug: slugify(artist, title),
      status,
    })
  })

  return albums
}

function parseUpcomingPage(html: string): AotyAlbum[] {
  const $ = cheerio.load(html)
  const albums: AotyAlbum[] = []
  const now = new Date()
  const year = now.getFullYear()

  $('.albumBlock.five').each((_, el) => {
    const $block = $(el)

    const albumLink = $block.find('a[href*="/album/"]').first()
    const albumHref = albumLink.attr('href')
    if (!albumHref) return

    const title = $block.find('.albumTitle').text().trim()
    if (!title) return

    const artist = $block.find('.artistTitle').first().text().trim() || 'Unknown'

    if (containsHangul(artist) || containsHangul(title) || KOREAN_ARTIST_DENYLIST.has(artist.toLowerCase())) return

    const typeText = $block.find('.type').text().trim()
    let releaseDate = parseAotyDate(typeText, year)
    if (releaseDate) {
      const d = new Date(releaseDate)
      if (d < now && typeText.match(/^(Jan|Feb|Mar|Apr|May|Jun)/)) {
        releaseDate = parseAotyDate(typeText, year + 1) || releaseDate
      }
    }
    if (!releaseDate) return

    let cover_image_url = $block.find('.image img').attr('src') || ''
    if (cover_image_url.startsWith('//')) cover_image_url = `https:${cover_image_url}`
    if (!cover_image_url && $block.find('.noCover').length) {
      cover_image_url = 'https://cdn.albumoftheyear.org/images/favicon.png'
    }

    const source_url = albumHref.startsWith('http') ? albumHref : `${AOTY_BASE}${albumHref.startsWith('/') ? '' : '/'}${albumHref}`

    albums.push({
      title,
      artist,
      release_date: releaseDate,
      cover_image_url: cover_image_url || '',
      source_url,
      aoty_score: null,
      slug: slugify(artist, title),
      status: 'upcoming',
    })
  })

  return albums
}

export async function crawlAotyReleased(): Promise<AotyAlbum[]> {
  const cutoff = monthsAgo(1)
  const all: AotyAlbum[] = []

  for (let page = 1; page <= MAX_PAGES; page++) {
    if (page > 1) await new Promise((r) => setTimeout(r, 1500))
    const url = page === 1 ? `${RELEASES_URL}/` : `${RELEASES_URL}/${page}/`
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) {
      if (res.status === 403 && page > 1) break // rate limit, use what we have
      throw new Error(`AOTY released fetch failed: ${res.status} ${url}`)
    }
    const html = await res.text()
    const albums = parseReleasedPage(html, 'released')

    if (albums.length === 0) break

    let oldestOnPage: Date | null = null
    for (const a of albums) {
      const d = new Date(a.release_date)
      if (d >= cutoff) all.push(a)
      if (!oldestOnPage || d < oldestOnPage) oldestOnPage = d
    }

    if (oldestOnPage && oldestOnPage < cutoff) break
  }

  return all
}

export async function crawlAotyUpcoming(): Promise<AotyAlbum[]> {
  const now = new Date()
  const future = new Date()
  future.setMonth(future.getMonth() + 3)
  const all: AotyAlbum[] = []

  const url = `${UPCOMING_URL}/`
  const res = await fetch(url, {
    headers: FETCH_HEADERS,
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`AOTY upcoming fetch failed: ${res.status} ${url}`)
  const html = await res.text()
  const albums = parseUpcomingPage(html)

  for (const a of albums) {
    const d = new Date(a.release_date)
    if (d >= now && d <= future) all.push(a)
  }

  return all
}
