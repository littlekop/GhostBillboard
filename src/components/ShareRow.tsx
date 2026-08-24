"use client";

import { useState } from "react";

export default function ShareRow({
  url,
  title,
  voteCount,
}: {
  url: string;
  title: string;
  voteCount: number;
}) {
  const [copied, setCopied] = useState(false);
  const shareText = `"${title}" หลอนขนาดนี้ ${voteCount.toLocaleString("th-TH")} โหวตแล้ว บนบิลบอร์ดผี`;

  const links = [
    {
      label: "LINE",
      href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do here
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-ink-faint">แชร์:</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm border border-hairline text-ink-dim rounded-full px-3 py-2 hover:border-ember hover:text-ember"
        >
          {l.label}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="text-sm border border-hairline text-ink-dim rounded-full px-3 py-2 hover:border-ember hover:text-ember"
      >
        {copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
      </button>
    </div>
  );
}
