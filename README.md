# NBM — 내가 보려고 만든 음악 정보

한국인을 위한 비상업적 음악 정보 플랫폼. 파편화된 국내외 음악 정보를 한 곳에서.

## 콘텐츠 카테고리

| 카테고리 | 소스 | 업데이트 |
|---------|------|---------|
| 글로벌 앨범 릴리즈 | Metacritic, AOTY | 일 1회 |
| 국내 인디 앨범 릴리즈 | 벅스 뮤직 | 일 1회 |
| 국내 인디 공연 | 각 클럽/공연장 사이트 | 일 1회 |
| 내한 공연 | 각 공연장 사이트 | 일 1회 |
| 국내 음악 페스티벌 | 각 페스티벌 공식 사이트 | 일 1회 |
| 해외 음악 페스티벌 | 각 페스티벌 공식 사이트 | 일 1회 |

## 기술 스택

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **State**: Zustand 5
- **Backend**: Supabase (Postgres, RLS, Storage)
- **Language**: TypeScript

## 로컬 실행

```bash
npm install
npm run dev
```

`.env.local`에 Supabase 환경변수 설정 필요:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## DB 마이그레이션

```bash
supabase db push
```

## 페이지 구조

```
/                      홈 (큐레이션 하이라이트)
/releases/global       글로벌 앨범 (upcoming + released)
/releases/domestic     국내 인디 앨범 (released only)
/events/concerts       공연 (국내 인디 + 내한)
/events/festivals      페스티벌 (국내 + 해외)
/artists/[slug]        아티스트 허브
/releases/[slug]       앨범 상세
/events/[slug]         이벤트 상세
```

## 프로젝트 구조

```
src/
  app/          Next.js App Router 페이지
  components/   UI 컴포넌트 (ui / releases / events / artists)
  lib/supabase/ Supabase 클라이언트 (browser + server)
  types/        TypeScript 타입 정의
  stores/       Zustand 스토어
supabase/
  migrations/   DB 마이그레이션 SQL
```
