import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto max-w-[760px] px-[18px] py-3.5 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-[22px] text-ink flex items-baseline gap-1.5">
          บิลบอร์ด<span className="text-blood-bright">ผี</span>
        </Link>
        <span className="font-mono text-[11px] tracking-[0.08em] text-ink-faint uppercase">
          Ghost Billboard
        </span>
      </div>
    </header>
  );
}
