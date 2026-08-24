"use client";

import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/lib/types";
import { storyPath } from "@/lib/slug";
import VoteButton from "./VoteButton";
import { useQuickView } from "./QuickViewProvider";

export default function StoryListItem({
  story,
  rank,
  gapToNext,
}: {
  story: Story;
  rank: number;
  gapToNext?: { votes: number; percent: number } | null;
}) {
  const { open } = useQuickView();

  const content = (
    <div className="flex items-center gap-3">
      <span className="font-display font-bold text-xl text-ink-faint w-[26px] text-center shrink-0">
        {rank}
      </span>
      <Link
        href={storyPath(story.slug, story.id)}
        onClick={(e) => {
          e.preventDefault();
          open(story);
        }}
        className="relative w-21 aspect-[16/10] rounded shrink-0 overflow-hidden bg-black"
        style={{ width: 84 }}
        aria-label={`เล่นคลิป ${story.title}`}
      >
        <Image
          src={story.thumbnailUrl}
          alt=""
          fill
          className="object-cover opacity-90"
          sizes="84px"
        />
        <div className="absolute inset-0 flex items-center justify-center text-ink text-[11px] bg-black/25">
          ▶
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] mb-0.5 leading-[1.35]">{story.title}</p>
        <p className="text-[13px] text-ink-faint">{story.channelName}</p>
      </div>
      <div className="shrink-0 text-right flex flex-col items-end gap-1">
        <VoteButton storyId={story.id} size="list" />
        <span className="font-mono text-[13px] text-ink-faint">
          {story.voteCount.toLocaleString("th-TH")}
        </span>
      </div>
    </div>
  );

  if (!gapToNext) {
    return <div className="py-3 border-b border-hairline">{content}</div>;
  }

  return (
    <div className="flex flex-col gap-2.5 border border-hairline rounded-lg p-3.5 mb-4.5">
      {content}
      <div>
        <div className="w-full h-[3px] bg-bg-2 rounded-full overflow-hidden">
          <span
            className="block h-full rounded-full"
            style={{
              width: `${gapToNext.percent}%`,
              background: "linear-gradient(90deg, var(--ember), var(--gold))",
            }}
          />
        </div>
        <p className="font-mono text-[12px] text-ink-faint mt-1">
          อีก {gapToNext.votes.toLocaleString("th-TH")} โหวตจะแซงอันดับถัดไป
        </p>
      </div>
    </div>
  );
}
