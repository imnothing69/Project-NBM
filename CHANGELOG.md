# Changelog

## [Unreleased]

### Added

**기획 / 아키텍처**
- 프로젝트 정의: NBM (내가 보려고 만든 음악 정보), 비상업적 음악 정보 플랫폼
- 콘텐츠 카테고리 6개 확정 (글로벌 앨범, 국내 인디 앨범, 국내 인디 공연, 내한 공연, 국내/해외 페스티벌)
- 데이터 수집 전략 확정: 크롤링 기반 자체 DB, 일 1회 자동 업데이트
- 국내 인디 앨범: 벅스 뮤직 크롤링, released only (upcoming 미제공 특성 반영)
- 글로벌 앨범: Metacritic/AOTY 크롤링, upcoming(3개월 이내) + released
- 아티스트 허브 페이지 개념 확정: releases + events 통합 뷰, 페스티벌 → 아티스트 하이퍼링크
- Phase 2 개인화 기능 예정: 로그인, 즐겨찾기, 알림, Topster

**프로젝트 셋업**
- Next.js 16 + TypeScript + Tailwind 4 + App Router 초기화
- Supabase SSR 클라이언트 설정 (`src/lib/supabase/client.ts`, `server.ts`)
- Zustand 5 설치
- App Router 페이지 구조 생성 (releases, events, artists, [slug] 포함)
- TypeScript 타입 정의 (`src/types/index.ts`): Artist, Release, Event, Venue, ReleaseArtist, EventArtist, CrawlLog
- `next.config.ts` 외부 이미지 도메인 설정 (metacritic, aoty, bugs)
- Supabase 마이그레이션 파일 생성 (`supabase/migrations/20260222000000_initial_schema.sql`)

**DB 스키마** (`20260222000000_initial_schema.sql`)
- 테이블: `artists`, `venues`, `releases`, `events`, `release_artists`, `event_artists`, `crawl_logs`
- Enum: `source_type`, `release_status`, `event_type`, `crawl_status`
- 인덱스 6개: source_type, status, release_date, event_type, date_start, artist slug
- `updated_at` 자동 갱신 트리거 (artists, releases, events, venues)
- CHECK constraint: 점수 범위 (0–100), 티켓 가격 역전 방지

**홈페이지 UI (Phase 3 — Mock Data)**
- `src/app/layout.tsx`: `lang="ko"`, title "NBM — 내가 보려고 만든 음악 정보", Geist 폰트
- `src/app/globals.css`: `background-color: #0A0A0A`, `color: #FFFFFF`
- `src/components/layout/Header.tsx`: NBM 로고 + 앨범/공연/페스티벌 nav
- `src/components/releases/AlbumCard.tsx`: 249×249px 커버 이미지 + 제목/아티스트/날짜
- `src/components/events/PerformanceCarousel.tsx`: 5초 자동 전환, 닷 네비게이션, 그라디언트 오버레이
- `src/components/ui/SpotlightCard.tsx`: 아티스트 스포트라이트 flex 카드
- `src/app/page.tsx`: Weekly Release (국내 인디 3 + 해외 3) + Upcoming Performance carousel + Artist Spotlight 3-up

### Fixed
- `src/app/layout.tsx`: `lang="ko"` 수정 (기본값 "en"에서 변경)
- `src/app/globals.css`: Cursor가 추가한 `font-family: Arial` 제거 → Geist 폰트 유지
- `next.config.ts`: Unsplash 이미지 도메인 `pathname: '/**'` 추가 (Next.js remotePatterns 요구사항)

### Known Issues (미해결)
- `PerformanceCarousel`: 이미지 전환 시 crossfade 미작동 (opacity 클래스가 src 변경에 반응 안 함) — 차후 수정 예정
- `next.config.ts`: 현재 Unsplash만 허용. 실데이터 크롤러 연결 시 metacritic.com, aoty.us, bugs.co.kr 도메인 추가 필요
