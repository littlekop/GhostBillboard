"use client";

import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/lib/types";
import { storyPath } from "@/lib/slug";
import VoteButton from "./VoteButton";
import { useQuickView } from "./QuickViewProvider";

export default function PodiumCard({
  story,
  rank,
}: {
  story: Story;
  rank: 1 | 2 | 3;
}) {
  const isFirst = rank === 1;
  const { open } = useQuickView();

  return (
    <div
      className={`group relative rounded-2xl border text-center transition-transform duration-200 hover:-translate-y-1 ${
        isFirst
          ? "border-gold-dim px-5 pt-6.5 pb-5.5"
          : "border-hairline bg-surface px-3.5 pt-4 pb-3.5"
      }`}
      style={
        isFirst
          ? {
              background:
                "linear-gradient(180deg, var(--surface-2), var(--surface) 70%)",
              boxShadow:
                "0 0 0 1px rgba(212,169,79,0.08), 0 18px 44px -18px rgba(212,169,79,0.35)",
            }
          : undefined
      }
    >
      {isFirst && (
        <span
          className="block text-xs mb-1.5"
          style={{
            color: "var(--gold)",
            filter: "drop-shadow(0 0 8px rgba(212,169,79,0.6))",
          }}
        >
          ✦ อันดับ 1 ตอนนี้ ✦
        </span>
      )}

      <div
        className={`font-display font-extrabold inline-flex items-baseline gap-1 mb-3 transition-[filter,color] duration-200 ${
          isFirst
            ? "text-[44px] text-gold"
            : "text-[26px] text-ink-dim group-hover:text-gold"
        }`}
        style={
          isFirst
            ? { textShadow: "0 0 30px rgba(212,169,79,0.5)" }
            : undefined
        }
      >
        <span className="text-[0.5em] opacity-70">#</span>
        {rank}
      </div>

      <Link
        href={storyPath(story.slug, story.id)}
        onClick={(e) => {
          e.preventDefault();
          open(story);
        }}
        className="block relative rounded-lg overflow-hidden mb-3 bg-black aspect-video"
        aria-label={`เล่นคลิป ${story.title}`}
      >
        <Image
          src={story.thumbnailUrl}
          alt=""
          fill
          className="object-cover opacity-90 transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, 280px"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/55 to-transparent">
          <span
            className={`rounded-full bg-black/70 border flex items-center justify-center text-ink transition-transform duration-200 group-hover:scale-110 ${
              isFirst
                ? "w-14 h-14 text-lg border-gold-dim"
                : "w-11 h-11 text-[15px] border-ink/35"
            }`}
          >
            ▶
          </span>
        </div>
      </Link>

      <p
        className={`font-display leading-[1.35] mb-1 text-balance ${
          isFirst ? "text-[19px] font-bold" : "text-sm font-semibold"
        }`}
      >
        {story.title}
      </p>
      <p className="text-[13px] text-ink-faint mb-3.5">{story.channelName}</p>

      <div className="flex flex-col gap-2 items-center">
        <VoteButton storyId={story.id} size={isFirst ? "podium-1" : "podium"} />
        <span className="font-mono tabular-nums text-[13px] text-ink-dim">
          <b className="text-ink text-base">{story.voteCount.toLocaleString("th-TH")}</b> โหวต
        </span>
      </div>
    </div>
  );
}
