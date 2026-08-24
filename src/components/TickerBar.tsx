"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

const AMBIENT_MESSAGES = [
  "🕯️ วางลิงก์ YouTube เรื่องผีของคุณ แล้วส่งเข้าชาร์ตได้เลย",
  "👁️ อย่าฟังเรื่องต่อไปนี้คนเดียวตอนดึก...",
  "👻 กดโหวตให้เรื่องที่หลอนที่สุด ดันมันขึ้นอันดับ 1",
  "🩸 แชร์ชาร์ตให้เพื่อนมาช่วยโหวตด้วยกัน",
  "💀 อันดับอาจเปลี่ยนได้ทุกวินาที ใครจะได้ที่ 1 คืนนี้",
];

const MAX_LIVE_EVENTS = 5;
const SEPARATOR = "　　★　　";
const CHARS_PER_SEC = 9; // reading speed the loop is timed to

export default function TickerBar() {
  const [liveEvents, setLiveEvents] = useState<string[]>([]);
  const lastVoteCounts = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("stories")
      .select("id, vote_count")
      .then(({ data }) => {
        if (cancelled || !data) return;
        for (const row of data) {
          if (!lastVoteCounts.current.has(row.id)) {
            lastVoteCounts.current.set(row.id, row.vote_count);
          }
        }
      });

    const channel = supabase
      .channel("site-ticker")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "stories" },
        (payload) => {
          const title = (payload.new as { title: string }).title;
          pushEvent(`🕯️ เรื่องใหม่ "${title}" เพิ่งถูกส่งเข้าชาร์ต`);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "stories" },
        (payload) => {
          const row = payload.new as { id: string; title: string; vote_count: number };
          const prev = lastVoteCounts.current.get(row.id) ?? row.vote_count;
          lastVoteCounts.current.set(row.id, row.vote_count);
          if (row.vote_count > prev) {
            pushEvent(`👻 มีคนเพิ่งโหวตเรื่อง "${row.title}" เมื่อครู่นี้`);
          }
        }
      )
      .subscribe();

    function pushEvent(text: string) {
      setLiveEvents((prev) => [text, ...prev].slice(0, MAX_LIVE_EVENTS));
    }

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const messages = liveEvents.length > 0 ? liveEvents : AMBIENT_MESSAGES;
  // One continuous strip, duplicated back-to-back, looping via translateX
  // 0 -> -50%: since both halves are identical, the loop point is invisible
  // — this is what makes it gap-free instead of a series of single-message
  // enter/exit passes with dead air between them.
  const strip = messages.join(SEPARATOR) + SEPARATOR;
  const duration = Math.max(14, strip.length / CHARS_PER_SEC);

  return (
    <div
      className="flex items-center gap-2 bg-bg-2 border border-hairline rounded-lg px-4 py-2 mb-3 font-mono text-sm text-ink-faint"
      role="status"
    >
      <span
        className="w-1.5 h-1.5 rounded-full bg-blood-bright shrink-0"
        style={{ boxShadow: "0 0 6px var(--blood-bright)" }}
        aria-hidden="true"
      />
      <div className="relative flex-1 h-[20px] overflow-hidden">
        <div
          className="absolute top-0 left-0 flex whitespace-nowrap animate-marquee-loop"
          style={{ animationDuration: `${duration}s` }}
        >
          <span>{strip}</span>
          <span aria-hidden="true">{strip}</span>
        </div>
      </div>
    </div>
  );
}
