import type { AffiliateItem } from "@/lib/types";

export default function AffiliateRow({
  title,
  items,
}: {
  title: string;
  items: AffiliateItem[];
}) {
  return (
    <div className="my-2 mb-6.5">
      <p className="font-display font-bold text-[15px] text-ember mb-3">{title}</p>
      <div className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1 -mx-[18px] px-[18px] scroll-smooth">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group relative block rounded-lg border border-ember-dim p-3 hover:border-ember transition-transform duration-200 shrink-0 w-[46%] sm:w-[160px] snap-start"
            style={{ background: "linear-gradient(160deg, var(--surface), var(--bg-2))" }}
          >
            <span className="absolute top-2 right-2 text-[9.5px] tracking-[0.06em] uppercase text-ember bg-ember/10 rounded px-1.5 py-0.5">
              พันธมิตร
            </span>
            <div
              className="w-8.5 h-8.5 rounded-lg flex items-center justify-center text-base mb-2.5 transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: item.color, width: 34, height: 34 }}
            >
              {item.emoji}
            </div>
            <p className="text-sm mb-1 leading-[1.35] text-ink font-semibold">{item.name}</p>
            <p className="text-[13px] text-ink-dim m-0">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
