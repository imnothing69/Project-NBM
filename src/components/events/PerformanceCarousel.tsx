'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Performance {
  id: string
  artist: string
  tourName: string
  venue: string
  date: string
  imageUrl: string
}

const MOCK_PERFORMANCES: Performance[] = [
  {
    id: '1',
    artist: 'Cigarettes After Sex',
    tourName: 'Korea Tour 2026',
    venue: '예스24 라이브홀 · 서울',
    date: '2026.03.15',
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b4f5e62?w=800&q=80',
  },
  {
    id: '2',
    artist: '새소년',
    tourName: '봄 단독공연',
    venue: '홍대 클럽 FF · 서울',
    date: '2026.03.28',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  },
  {
    id: '3',
    artist: 'Adrianne Lenker',
    tourName: 'Korea Solo Tour',
    venue: '예스24 라이브홀 · 서울',
    date: '2026.05.10',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
  },
]

export default function PerformanceCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % MOCK_PERFORMANCES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const perf = MOCK_PERFORMANCES[current]

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden cursor-pointer">
      <Image
        src={perf.imageUrl}
        alt={perf.artist}
        fill
        className="object-cover transition-opacity duration-700"
        priority
      />
      {/* bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-6 px-6">
        <span className="inline-block bg-[#F38892] text-black text-[11px] font-bold px-2.5 py-1 rounded mb-3">
          공연 · {perf.date}
        </span>
        <p className="text-[28px] font-bold text-white leading-tight">{perf.artist}</p>
        <p className="text-[14px] text-[#BBBBBB] mt-1">{perf.tourName}</p>
        <p className="text-[12px] text-[#888888] mt-0.5">{perf.venue}</p>
        {/* dots */}
        <div className="flex gap-2 mt-4">
          {MOCK_PERFORMANCES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? 'w-2 h-2 bg-[#F38892]'
                  : 'w-1.5 h-1.5 bg-[#555555]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
