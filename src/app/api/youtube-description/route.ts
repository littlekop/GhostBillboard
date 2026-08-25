import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;
const MAX_LENGTH = 220;

// Keep this to a short excerpt, not the full text — it's the channel
// owner's copyrighted writing, so we quote just enough to identify the
// clip (like a search-result snippet) and send readers back to the
// source for the rest, rather than republishing it wholesale.
function excerpt(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= MAX_LENGTH) return clean;
  const cut = clean.slice(0, MAX_LENGTH);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : MAX_LENGTH)}…`;
}

export async function GET(req: NextRequest) {
  const youtubeId = req.nextUrl.searchParams.get("id");
  if (!youtubeId || !YOUTUBE_ID_RE.test(youtubeId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ description: null });
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${apiKey}`
  );
  if (!res.ok) {
    return NextResponse.json({ description: null });
  }

  const data = await res.json();
  const description: string | undefined = data.items?.[0]?.snippet?.description;
  const trimmed = description?.trim();

  return NextResponse.json({ description: trimmed ? excerpt(trimmed) : null });
}
