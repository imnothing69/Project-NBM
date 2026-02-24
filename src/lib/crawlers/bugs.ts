import * as cheerio from 'cheerio'
import { slugify, monthsAgo } from './utils'

const BUGS_BASE = 'https://music.bugs.co.kr'
const BUGS_INDIE_URL = `${BUGS_BASE}/newest/album/nindie`
const MAX_PAGES = 10

const FETCH_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'ko-KR,ko;q=0.9',
}

export interface BugsAlbum {
  title: string
  artist: string
  release_date: string // "YYYY-MM-DD"
  cover_image_url: string
  source_url: string
  slug: string
}

function extractAlbumId(href: string): string | null {
  const match = href.match(/\/album\/(\d+)/)
  return match ? match[1] : null
}

function parseDate(text: string): string | null {
  // "YYYY.MM.DD 정규" | "YYYY.MM.DD EP(미니)" | "YYYY.MM.DD 싱글"
  const match = text.match(/(\d{4})\.(\d{2})\.(\d{2})/)
  if (!match) return null
  return `${match[1]}-${match[2]}-${match[3]}`
}

function parsePage(html: string): BugsAlbum[] {
  const $ = cheerio.load(html)
  const albums: BugsAlbum[] = []

  // Album list: each album has <a href=".../album/{id}?wl_ref=list_ab_03">
  $('a[href*="/album/"][href*="wl_ref=list_ab_03"]').each((_, el) => {
    const $albumLink = $(el)
    const $li = $albumLink.closest('li')
    if (!$li.length) return

    const albumHref = $albumLink.attr('href')
    if (!albumHref) return

    const albumId = extractAlbumId(albumHref)
    if (!albumId) return

    const title = $albumLink.text().trim()
    if (!title) return

    // Artist link: <a href=".../artist/{id}?wl_ref=list_ab_04">
    const artistLink = $li.find('a[href*="/artist/"][href*="wl_ref=list_ab_04"]').first()
    const artist = artistLink.text().trim() || 'Unknown'

    // Date: text node "YYYY.MM.DD 정규|EP(미니)|싱글"
    const text = $li.text()
    const releaseDate = parseDate(text)
    if (!releaseDate) return

    // Cover: https://image.bugsm.co.kr/album/images/170/{id}/{id}.jpg
    const cover_image_url = `https://image.bugsm.co.kr/album/images/170/${albumId}/${albumId}.jpg`
    const source_url = `https://music.bugs.co.kr/album/${albumId}`

    albums.push({
      title,
      artist,
      release_date: releaseDate,
      cover_image_url,
      source_url,
      slug: slugify(artist, title),
    })
  })

  return albums
}

/**
 * Crawl bugs.co.kr nindie album list.
 * Returns albums released within the last 1 month.
 * Stops when oldest album on page is older than 1 month, or max 10 pages.
 */
export async function crawlBugsIndieAlbums(): Promise<BugsAlbum[]> {
  const cutoff = monthsAgo(1)
  const all: BugsAlbum[] = []

  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `${BUGS_INDIE_URL}?page=${page}`
    const res = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(10000), // 10초 timeout
    })
    if (!res.ok) {
      throw new Error(`Bugs fetch failed: ${res.status} ${url}`)
    }
    const html = await res.text()
    const albums = parsePage(html)

    if (albums.length === 0) break

    let oldestOnPage: Date | null = null
    for (const a of albums) {
      const d = new Date(a.release_date)
      if (d >= cutoff) {
        all.push(a)
      }
      if (!oldestOnPage || d < oldestOnPage) oldestOnPage = d
    }

    if (oldestOnPage && oldestOnPage < cutoff) break
  }

  return all
}
