import type { MetadataRoute } from "next";
import { getStories } from "@/lib/data";
import { storyPath } from "@/lib/slug";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ghostbillboard.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const stories = await getStories({ view: "latest" });

  return [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    ...stories.map((s) => ({
      url: `${SITE_URL}${storyPath(s.slug, s.id)}`,
      lastModified: s.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
