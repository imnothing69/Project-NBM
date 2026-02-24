export type SourceType = 'domestic_indie' | 'global'
export type ReleaseStatus = 'upcoming' | 'released'
export type EventType = 'indie_concert' | 'tour_in_korea' | 'domestic_festival' | 'international_festival'
export type CrawlStatus = 'success' | 'failed' | 'partial'

export interface Artist {
  id: string
  name: string
  name_kr: string | null
  origin_country: string | null
  genre: string[]
  image_url: string | null
  slug: string
  created_at: string
  updated_at: string
}

export interface Venue {
  id: string
  name: string
  name_kr: string | null
  city: string
  country: string
  website_url: string | null
  created_at: string
  updated_at: string
}

export interface Release {
  id: string
  title: string
  release_date: string
  label: string | null
  genres: string[]
  cover_image_url: string | null
  source_type: SourceType
  status: ReleaseStatus
  metacritic_score: number | null
  aoty_score: number | null
  source_url: string | null
  slug: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  event_type: EventType
  date_start: string
  date_end: string | null
  venue_id: string
  ticket_url: string | null
  ticket_price_min: number | null
  ticket_price_max: number | null
  poster_image_url: string | null
  source_url: string | null
  slug: string
  created_at: string
  updated_at: string
}

export interface ReleaseArtist {
  release_id: string
  artist_id: string
}

export interface EventArtist {
  event_id: string
  artist_id: string
  is_headliner: boolean
}

export interface CrawlLog {
  id: string
  source: string
  crawled_at: string
  status: CrawlStatus
  records_upserted: number | null
  error_message: string | null
}
