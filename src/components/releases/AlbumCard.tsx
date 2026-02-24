import Image from 'next/image'

interface AlbumCardProps {
  title: string
  artist: string
  date: string
  coverUrl: string
}

export default function AlbumCard({ title, artist, date, coverUrl }: AlbumCardProps) {
  return (
    <div className="w-[249px] flex-shrink-0 rounded bg-[#141414] overflow-hidden cursor-pointer group">
      <div className="relative w-full h-[249px] bg-[#1E1E1E]">
        <Image
          src={coverUrl}
          alt={`${title} - ${artist}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="px-3 py-[10px] flex flex-col gap-1">
        <p className="text-[13px] font-semibold text-white truncate">{title}</p>
        <p className="text-[12px] text-[#888888] truncate">{artist}</p>
        <p className="text-[11px] text-[#555555]">{date}</p>
      </div>
    </div>
  )
}
