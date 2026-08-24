"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Story } from "@/lib/types";
import VideoPlayer from "./VideoPlayer";
import VoteButton from "./VoteButton";
import ChatPanel from "./ChatPanel";
import ShareRow from "./ShareRow";
import { storyPath } from "@/lib/slug";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ghostbillboard.example";

interface QuickViewContextValue {
  open: (story: Story) => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

// Lets any story card open an instant preview instead of a full page
// navigation — the real <a href="/story/..."> stays in the markup for
// crawlers/right-click/share, this is purely a client-side fast path.
export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView must be used within QuickViewProvider");
  return ctx;
}

export default function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [story, setStory] = useState<Story | null>(null);

  const open = useCallback((s: Story) => setStory(s), []);
  const close = useCallback(() => setStory(null), []);

  return (
    <QuickViewContext.Provider value={{ open }}>
      {children}
      {story && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6"
          onClick={close}
        >
          <div
            className="bg-bg border border-hairline rounded-xl w-full max-w-[900px] max-h-[92vh] overflow-y-auto p-4 sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <h2 className="font-display font-bold text-lg text-ink text-balance leading-snug">
                  {story.title}
                </h2>
                <p className="text-ink-faint text-sm">{story.channelName}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="ปิด"
                className="shrink-0 w-9 h-9 rounded-full border border-hairline text-ink-dim hover:text-ink hover:border-ember flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 items-start">
              <div>
                <VideoPlayer youtubeId={story.youtubeId} title={story.title} />
                <div className="flex items-center gap-3 mt-4">
                  <VoteButton storyId={story.id} size="podium" />
                  <span className="font-mono tabular-nums text-sm text-ink-dim">
                    <b className="text-ink">{story.voteCount.toLocaleString("th-TH")}</b> โหวต
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-hairline">
                  <ShareRow
                    url={`${SITE_URL}${storyPath(story.slug, story.id)}`}
                    title={story.title}
                    voteCount={story.voteCount}
                  />
                </div>
              </div>
              <ChatPanel storyId={story.id} />
            </div>
          </div>
        </div>
      )}
    </QuickViewContext.Provider>
  );
}
