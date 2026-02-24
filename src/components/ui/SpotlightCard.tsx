import Image from 'next/image'

interface SpotlightCardProps {
  title: string
  description: string
  imageUrl: string
}

export default function SpotlightCard({ title, description, imageUrl }: SpotlightCardProps) {
  return (
    <div className="flex-1 bg-[#141414] rounded-lg overflow-hidden cursor-pointer group">
      <div className="relative w-full h-[160px] bg-[#1E1E1E]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <p className="text-[14px] font-semibold text-white leading-snug">{title}</p>
        <p className="text-[12px] text-[#888888]">{description}</p>
      </div>
    </div>
  )
}
