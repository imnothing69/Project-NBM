# NBM Design Brief
**내가 보려고 만든 음악 정보** — Non-commercial Korean music information platform

---

## 1. Project Overview

NBM is a non-commercial web platform that aggregates fragmented Korean music information into one place. Target audience: Korean music enthusiasts who follow domestic indie scenes and international releases.

**Content categories:**
- 국내 인디 앨범 릴리즈 (Domestic indie album releases)
- 글로벌 앨범 릴리즈 (Global album releases — with Upcoming / Released status)
- 국내 인디 공연 (Domestic indie concerts)
- 내한 공연 (International artists touring Korea)
- 국내 음악 페스티벌 (Domestic music festivals)
- 해외 음악 페스티벌 (International music festivals)

---

## 2. Design References

**Primary references:**
- [NME](https://www.nme.com) — Bold condensed typography, dark background, card-based grid, fixed header with category nav
- [Crack Magazine](https://crackmagazine.net) — Horizontal tab navigation (READ/WATCH/LISTEN), editorial card layout, stark contrast

**Mood:** Dark editorial. Think music journalism, not streaming platform. No gradients, no flashy animations. Information-first.

---

## 3. Color System

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0A0A0A` | Page background |
| Card | `#141414` | Album cards, event cards |
| Card hover | `#1A1A1A` | Card hover state |
| Border | `#222222` | Dividers, header border |
| Accent | `#F38892` | Labels (국내 인디 / 해외), badges, active nav, dots |
| Text primary | `#FFFFFF` | Headings, album titles |
| Text secondary | `#888888` | Artist names, descriptions |
| Text muted | `#555555` | Dates, meta info |
| Text link | `#666666` | "전체보기 →" links |

---

## 4. Typography

- **Font:** Inter (system fallback)
- **Logo "NBM":** 26px, bold, white
- **Section headers:** 20px, bold, white (e.g. "Weekly Release", "Upcoming Performance")
- **Album title:** 13px, semibold, white
- **Artist name:** 12px, regular, `#888888`
- **Date / meta:** 11px, regular, `#555555`
- **Nav items:** 14px, regular, `#888888` (active: `#F38892`)
- **Category labels (국내 인디 / 해외):** 11px, bold, `#F38892`
- **Event badge:** 11px, bold, black on `#F38892` background

---

## 5. Layout — Desktop (1440px)

```
┌─────────────────────────────────────────────────────┐
│  HEADER (h:64px, px:60px)                           │
│  NBM                          앨범  공연  페스티벌     │
├─────────────────────────────────────────────────────┤
│  BODY (px:60px, py:40px, gap:40px)                  │
│  ┌──────────────────────┐  ┌────────────────────┐   │
│  │ LEFT COL (780px)     │  │ RIGHT COL (500px)  │   │
│  │                      │  │                    │   │
│  │ Weekly Release       │  │ Upcoming           │   │
│  │ 전체보기 →           │  │ Performance        │   │
│  │                      │  │ 전체보기 →         │   │
│  │ 국내 인디 ━━━━━━━━   │  │                    │   │
│  │ [앨범] [앨범] [앨범] │  │  ┌──────────────┐  │   │
│  │                      │  │  │              │  │   │
│  │ 해외 ━━━━━━━━━━━━━   │  │  │  Concert     │  │   │
│  │ [앨범] [앨범] [앨범] │  │  │  Poster      │  │   │
│  │                      │  │  │  Image       │  │   │
│  └──────────────────────┘  │  │              │  │   │
│                             │  │ ─────────── │  │   │
│                             │  │ [공연 badge]│  │   │
│                             │  │ Artist Name │  │   │
│                             │  │ Tour Title  │  │   │
│                             │  │ Venue · 서울│  │   │
│                             │  │ • ○ ○       │  │   │
│                             │  └──────────────┘  │   │
│                             └────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  ──── divider ────────────────────────────────────  │
├─────────────────────────────────────────────────────┤
│  ARTIST SPOTLIGHT (px:60px, py:32px)                │
│  Artist Spotlight              전체보기 →            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │  Image   │ │  Image   │ │  Image   │            │
│  │ Title    │ │ Title    │ │ Title    │            │
│  │ desc     │ │ desc     │ │ desc     │            │
│  └──────────┘ └──────────┘ └──────────┘            │
└─────────────────────────────────────────────────────┘
```

---

## 6. Component Specs

### Header
- Height: 64px
- Padding: 0 60px
- Background: `#0A0A0A`
- Border-bottom: 1px `#222222`
- Left: "NBM" logo (26px bold white)
- Right: nav links (앨범 / 공연 / 페스티벌), current active = `#F38892`

### Album Card
- Width: 249px
- Background: `#141414`
- Border-radius: 4px
- **Cover image:** 249×249px, object-cover, hover: slight scale-up
- **Info area:** padding 10px 12px, vertical gap 4px
  - Title: 13px semibold white
  - Artist: 12px `#888888`
  - Date: 11px `#555555`

### Weekly Release Section (Left Column)
- 3×2 grid (두 개의 row, 각 row는 3장)
- Row 1 label: "국내 인디" — 11px bold `#F38892`
- Row 2 label: "해외" — 11px bold `#F38892`
- Card gap: 16px (horizontal)
- Row gap: 20px (vertical)

### Upcoming Performance Carousel (Right Column)
- Width: 500px, Height: 600px
- Full-bleed concert poster image (object-cover)
- **Bottom overlay:** gradient from transparent to `#000000EE`
- **Date badge:** `#F38892` bg, black text, 11px bold, rounded, inline
- **Artist name:** 28px bold white
- **Tour title:** 14px `#BBBBBB`
- **Venue:** 12px `#888888`
- **Dots:** active = 8px circle `#F38892`, inactive = 6px `#555555`
- **Auto-advance:** every 5 seconds
- **Manual:** clicking dots navigates

### Artist Spotlight (Bottom Section)
- 3-column equal-width card layout
- Gap: 24px
- Each card: `#141414` bg, 8px border-radius, overflow-hidden
  - Image: 160px tall, object-cover, hover: slight scale-up
  - Body: padding 16px, gap 6px
  - Title: 14px semibold white
  - Description: 12px `#888888`

---

## 7. Interaction Notes

- All cards: cursor-pointer, image zooms slightly on hover (scale 1.05, transition 300ms)
- Nav links: hover → white
- Carousel: keyboard-accessible dot buttons
- "전체보기 →" links: hover → white

---

## 8. What NOT to do

- No light backgrounds anywhere on this page
- No colorful gradients or decorative animations
- No rounded pill buttons (keep it editorial/sharp)
- No Spotify/streaming-platform aesthetic
- No shadows — use fills and borders instead
- The vibe is **music journalism**, not **music discovery app**
