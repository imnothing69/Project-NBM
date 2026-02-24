-- UP

-- Enums
CREATE TYPE source_type AS ENUM ('domestic_indie', 'global');
CREATE TYPE release_status AS ENUM ('upcoming', 'released');
CREATE TYPE event_type AS ENUM ('indie_concert', 'tour_in_korea', 'domestic_festival', 'international_festival');
CREATE TYPE crawl_status AS ENUM ('success', 'failed', 'partial');

-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- artists
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_kr TEXT,
  origin_country TEXT,
  genre TEXT[] DEFAULT '{}',
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_artists_slug ON artists(slug);

CREATE TRIGGER artists_updated_at
  BEFORE UPDATE ON artists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- venues
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_kr TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER venues_updated_at
  BEFORE UPDATE ON venues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- releases
CREATE TABLE releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  release_date DATE NOT NULL,
  label TEXT,
  genres TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  source_type source_type NOT NULL,
  status release_status NOT NULL DEFAULT 'released',
  metacritic_score SMALLINT CHECK (metacritic_score BETWEEN 0 AND 100),
  aoty_score SMALLINT CHECK (aoty_score BETWEEN 0 AND 100),
  source_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_releases_source_type ON releases(source_type);
CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_releases_release_date ON releases(release_date DESC);

CREATE TRIGGER releases_updated_at
  BEFORE UPDATE ON releases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  event_type event_type NOT NULL,
  date_start DATE NOT NULL,
  date_end DATE,
  venue_id UUID REFERENCES venues(id),
  ticket_url TEXT,
  ticket_price_min INTEGER,
  ticket_price_max INTEGER,
  poster_image_url TEXT,
  source_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (ticket_price_min IS NULL OR ticket_price_max IS NULL OR ticket_price_min <= ticket_price_max)
);

CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_date_start ON events(date_start);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- release_artists (junction)
CREATE TABLE release_artists (
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  PRIMARY KEY (release_id, artist_id)
);

-- event_artists (junction)
CREATE TABLE event_artists (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  is_headliner BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (event_id, artist_id)
);

-- crawl_logs
CREATE TABLE crawl_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  crawled_at TIMESTAMPTZ DEFAULT NOW(),
  status crawl_status NOT NULL,
  records_upserted INTEGER,
  error_message TEXT
);

-- DOWN
-- DROP TABLE IF EXISTS crawl_logs, event_artists, release_artists, events, releases, venues, artists CASCADE;
-- DROP TYPE IF EXISTS source_type, release_status, event_type, crawl_status;
-- DROP FUNCTION IF EXISTS update_updated_at;
