import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full h-16 flex items-center justify-between px-[60px] border-b border-[#222222] bg-[#0A0A0A]">
      <Link href="/" className="text-[26px] font-bold text-white tracking-tight">
        NBM
      </Link>
      <nav className="flex items-center gap-9">
        <Link href="/releases" className="text-sm text-[#888888] hover:text-white transition-colors">앨범</Link>
        <Link href="/events/concerts" className="text-sm text-[#F38892] hover:text-white transition-colors">공연</Link>
        <Link href="/events/festivals" className="text-sm text-[#888888] hover:text-white transition-colors">페스티벌</Link>
      </nav>
    </header>
  )
}
