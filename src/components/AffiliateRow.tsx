"use client";

import { useEffect, useState } from "react";
import type { AffiliateItem } from "@/lib/types";

const WINDOW_SIZE = 2;
const ROTATE_MS = 7000;

export default function AffiliateRow({
  title,
  items,
}: {
  title: string;
  items: AffiliateItem[];
}) {
  const [start, setStart] = useState(0);

  useEffect(() => {
    if (items.length <= WINDOW_SIZE) return;
    const t = setInterval(() => {
      setStart((s) => (s + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [items.length]);

  const visible = Array.from(
    { length: Math.min(WINDOW_SIZE, items.length) },
    (_, i) => items[(start + i) % items.length]
  );

  return (
    <div className="my-2 mb-6.5">
      <p className="font-display font-bold text-[15px] text-ember mb-3">{title}</p>
      <div className="grid grid-cols-2 gap-2.5 max-w-[360px] mx-auto">
        {visible.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group relative block rounded-lg border border-ember-dim p-3 hover:border-ember hover:-translate-y-0.5 transition-transform duration-200 animate-fade-in"
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
