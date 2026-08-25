import { NextRequest, NextResponse } from "next/server";

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

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

  return NextResponse.json({ description: description?.trim() || null });
}
