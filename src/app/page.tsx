import Header from '@/components/layout/Header'
import AlbumCard from '@/components/releases/AlbumCard'
import PerformanceCarousel from '@/components/events/PerformanceCarousel'
import SpotlightCard from '@/components/ui/SpotlightCard'
import Link from 'next/link'

const DOMESTIC_ALBUMS = [
  { title: '겨울 속에서', artist: '새소년', date: '2026.02.14', coverUrl: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&q=80' },
  { title: '무중력', artist: '잔나비', date: '2026.02.07', coverUrl: 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&q=80' },
  { title: '밤의 소리들', artist: '이날치', date: '2026.02.01', coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&q=80' },
]

const GLOBAL_ALBUMS = [
  { title: "Short n' Sweet", artist: 'Sabrina Carpenter', date: '2025.08.23', coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&q=80' },
  { title: 'Manning Fireworks', artist: 'MJ Lenderman', date: '2025.09.27', coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&q=80' },
  { title: 'Bright Future', artist: 'Adrianne Lenker', date: '2025.03.01', coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80' },
]

const SPOTLIGHT = [
  { title: '새소년, 봄 단독공연 개최 예정', description: '3월 서울 콘서트, 티켓 오픈 예정', imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=600&q=80' },
  { title: '펜타포트 2026 라인업 발표', description: '8월 인천 송도, 헤드라이너 공개', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80' },
  { title: 'Adrianne Lenker 내한공연 확정', description: '5월 예스24 라이브홀, 단독공연', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header />

      {/* Main body */}
      <div className="flex gap-10 px-[60px] py-10">
        {/* Left: Weekly Release */}
        <div className="flex flex-col gap-5 w-[780px]">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl font-bold text-white">Weekly Release</h2>
            <Link href="/releases" className="ml-auto text-xs text-[#666666] hover:text-white transition-colors">
              전체보기 →
            </Link>
          </div>

          {/* 국내 인디 */}
          <div>
            <p className="text-[11px] font-bold text-[#F38892] mb-3">국내 인디</p>
            <div className="flex gap-4">
              {DOMESTIC_ALBUMS.map((album) => (
                <AlbumCard key={album.title} {...album} />
              ))}
            </div>
          </div>

          {/* 해외 */}
          <div>
            <p className="text-[11px] font-bold text-[#F38892] mb-3">해외</p>
            <div className="flex gap-4">
              {GLOBAL_ALBUMS.map((album) => (
                <AlbumCard key={album.title} {...album} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Upcoming Performance */}
        <div className="flex flex-col gap-5 w-[500px]">
          <div className="flex items-baseline">
            <h2 className="text-xl font-bold text-white">Upcoming Performance</h2>
            <Link href="/events/concerts" className="ml-auto text-xs text-[#666666] hover:text-white transition-colors">
              전체보기 →
            </Link>
          </div>
          <PerformanceCarousel />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-[60px] h-px bg-[#222222]" />

      {/* Artist Spotlight */}
      <div className="px-[60px] py-8 flex flex-col gap-5">
        <div className="flex items-baseline">
          <h2 className="text-xl font-bold text-white">Artist Spotlight</h2>
          <Link href="/artists" className="ml-auto text-xs text-[#666666] hover:text-white transition-colors">
            전체보기 →
          </Link>
        </div>
        <div className="flex gap-6">
          {SPOTLIGHT.map((item) => (
            <SpotlightCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}
