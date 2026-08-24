"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          events: {
            onError: (e: { data: number }) => void;
          };
        }
      ) => unknown;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// YouTube error codes 101 and 150 both mean "embedding disabled by the owner".
const EMBED_DISABLED_CODES = new Set([101, 150]);

export default function VideoPlayer({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [embedBlocked, setEmbedBlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (cancelled || !containerRef.current || !window.YT) return;
      new window.YT.Player(containerRef.current, {
        videoId: youtubeId,
        events: {
          onError: (e) => {
            if (EMBED_DISABLED_CODES.has(e.data)) setEmbedBlocked(true);
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
    }

    return () => {
      cancelled = true;
    };
  }, [youtubeId]);

  if (embedBlocked) {
    return (
      <div className="aspect-video rounded-lg border border-hairline bg-surface flex flex-col items-center justify-center gap-3 text-center px-6">
        <p className="text-ink-dim text-sm">คลิปนี้ไม่อนุญาตให้เล่นในหน้าเว็บอื่น</p>
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-blood text-[#fff2ea] border border-blood-bright rounded-full px-5 py-2.5 text-sm font-semibold hover:brightness-110"
        >
          ดูใน YouTube
        </a>
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <div ref={containerRef} className="w-full h-full">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&enablejsapi=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
