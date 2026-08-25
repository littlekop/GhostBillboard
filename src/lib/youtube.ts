export function extractYoutubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

export interface OEmbedInfo {
  title: string;
  channelName: string;
  thumbnailUrl: string;
}

export async function fetchOEmbed(youtubeId: string): Promise<OEmbedInfo | null> {
  const res = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(
      `https://www.youtube.com/watch?v=${youtubeId}`
    )}&format=json`
  );
  if (!res.ok) return null;
  const data = await res.json();
  return {
    title: data.title,
    channelName: data.author_name,
    thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  };
}

// Best-effort — falls back to no description if the API key is missing,
// the clip has none, or the request fails for any reason.
export async function fetchVideoDescription(youtubeId: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/youtube-description?id=${youtubeId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.description ?? null;
  } catch {
    return null;
  }
}
