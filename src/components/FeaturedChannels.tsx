import type { FeaturedChannel } from "@/lib/types";

const ICONS = ["📻", "🎙️"];

export default function FeaturedChannels({
  channels,
}: {
  channels: FeaturedChannel[];
}) {
  return (
    <div className="my-2 mb-7">
      <div className="flex items-center gap-2.5 mb-1">
        <span
          className="w-2 h-2 rounded-full bg-gold shrink-0"
          style={{ boxShadow: "0 0 8px var(--gold)" }}
          aria-hidden="true"
        />
        <p className="font-display font-black text-[19px] text-ink tracking-wide">
          ช่องแนะนำสำหรับเรื่องผี
        </p>
      </div>
      <p className="text-[13px] text-ink-faint mb-3.5">
        เรื่องเล่าในชาร์ตนี้มาจากคลิปของสองช่องนี้เป็นหลัก กดติดตามเพื่อสนับสนุนต้นทางกันได้เลย
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {channels.map((c, i) => (
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex gap-3.5 items-start rounded-xl p-4 border border-gold-dim hover:border-gold transition-colors"
            style={{
              background: "linear-gradient(160deg, var(--surface-2), var(--bg-2) 75%)",
              boxShadow: "0 0 0 1px rgba(212,169,79,0.06), 0 14px 32px -18px rgba(212,169,79,0.3)",
            }}
          >
            <div
              className="shrink-0 rounded-full border border-gold-dim flex items-center justify-center text-2xl"
              style={{
                width: 52,
                height: 52,
                background: "linear-gradient(160deg, var(--surface), var(--bg-3))",
              }}
            >
              {ICONS[i % ICONS.length]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                <span className="font-display font-bold text-[17px] text-ink">{c.name}</span>
                <span className="font-mono text-[9.5px] tracking-[0.06em] text-gold border border-gold-dim rounded px-1.5 py-0.5">
                  ต้นทางหลัก
                </span>
              </div>
              <p className="text-[13px] text-ink-dim leading-relaxed m-0 mb-2">{c.desc}</p>
              <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-gold group-hover:text-ember">
                ไปที่ช่อง YouTube →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
