import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getRelatedStories, getStoryById } from "@/lib/data";
import { idFromParam, storyPath } from "@/lib/slug";
import Header from "@/components/Header";
import VoteButton from "@/components/VoteButton";
import VideoPlayer from "@/components/VideoPlayer";
import ChatPanel from "@/components/ChatPanel";
import ShareRow from "@/components/ShareRow";
import ReportButton from "@/components/ReportButton";
import Footer from "@/components/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ghostbillboard.example";

async function loadStory(storySlug: string) {
  const id = idFromParam(storySlug);
  return getStoryById(id);
}

export async function generateMetadata({
  params,
}: PageProps<"/story/[storySlug]">): Promise<Metadata> {
  const { storySlug } = await params;
  const story = await loadStory(storySlug);
  if (!story) return {};

  const title = story.title;
  const description = `${story.title} โดย ${story.channelName} — โหวตแล้ว ${story.voteCount.toLocaleString("th-TH")} ครั้งบนบิลบอร์ดผี`;

  return {
    title,
    description,
    alternates: { canonical: storyPath(story.slug, story.id) },
    openGraph: {
      title,
      description,
      type: "video.other",
      images: [{ url: story.thumbnailUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [story.thumbnailUrl],
    },
  };
}

export default async function StoryPage({
  params,
}: PageProps<"/story/[storySlug]">) {
  const { storySlug } = await params;
  const story = await loadStory(storySlug);
  if (!story) notFound();

  const related = await getRelatedStories(story.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: story.title,
    description: story.title,
    thumbnailUrl: [story.thumbnailUrl],
    uploadDate: story.createdAt,
    embedUrl: `https://www.youtube.com/embed/${story.youtubeId}`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: story.voteCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="mx-auto max-w-[1000px] px-[18px] py-6 flex-1 w-full">
        <Link href="/" className="text-sm text-ink-faint hover:text-ember">
          ← กลับไปหน้าชาร์ต
        </Link>

        <h1 className="font-display font-bold text-2xl mt-3 mb-1 text-balance">
          {story.title}
        </h1>
        <p className="text-ink-faint text-sm mb-4">{story.channelName}</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-start">
          <div>
            <VideoPlayer youtubeId={story.youtubeId} title={story.title} />

            <div className="flex items-center gap-3 mt-4">
              <VoteButton storyId={story.id} size="podium" />
              <span className="font-mono tabular-nums text-sm text-ink-dim">
                <b className="text-ink">{story.voteCount.toLocaleString("th-TH")}</b> โหวต
              </span>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3 mt-4 pt-4 border-t border-hairline">
              <ShareRow
                url={`${SITE_URL}${storyPath(story.slug, story.id)}`}
                title={story.title}
                voteCount={story.voteCount}
              />
              <ReportButton storyId={story.id} />
            </div>
          </div>

          <ChatPanel storyId={story.id} />
        </div>

        {related.length > 0 && (
          <div className="mt-8 pt-6 border-t border-hairline">
            <p className="font-display font-bold text-[17px] text-ink mb-3">
              เรื่องผีอื่นที่น่าดู
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={storyPath(r.slug, r.id)}
                  className="group block"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-1.5">
                    <Image
                      src={r.thumbnailUrl}
                      alt=""
                      fill
                      className="object-cover opacity-90 transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, 240px"
                    />
                  </div>
                  <p className="text-[13px] text-ink leading-snug line-clamp-2 group-hover:text-ember">
                    {r.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
