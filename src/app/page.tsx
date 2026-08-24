import { AFF_ITEMS, FEATURED_CHANNELS, getStories, type RangeId, type ViewMode } from "@/lib/data";
import Header from "@/components/Header";
import TickerBar from "@/components/TickerBar";
import Hero from "@/components/Hero";
import Tabs from "@/components/Tabs";
import PodiumCard from "@/components/PodiumCard";
import StoryListItem from "@/components/StoryListItem";
import AdSlot from "@/components/AdSlot";
import AffiliateRow from "@/components/AffiliateRow";
import FeaturedChannels from "@/components/FeaturedChannels";
import Footer from "@/components/Footer";
import TipFab from "@/components/TipFab";
import EmberField from "@/components/EmberField";
import QuickViewProvider from "@/components/QuickViewProvider";

function isViewMode(v: string | undefined): v is ViewMode {
  return v === "rank" || v === "latest";
}

function isRangeId(v: string | undefined): v is RangeId {
  return v === "today" || v === "week" || v === "all";
}

export default async function HomePage({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const viewParam = Array.isArray(params.view) ? params.view[0] : params.view;
  const rangeParam = Array.isArray(params.range) ? params.range[0] : params.range;
  const view: ViewMode = isViewMode(viewParam) ? viewParam : "rank";
  const range: RangeId = isRangeId(rangeParam) ? rangeParam : "all";

  const stories = await getStories({ view, range });
  const [first, second, third, ...rest] = stories;
  const isRankView = view === "rank";

  // Hero's floating preview always shows the all-time #1, independent of
  // whatever view/range filter is currently applied to the list below.
  const [allTimeTop] = await getStories({ view: "rank", range: "all" });

  return (
    <QuickViewProvider>
      <EmberField />
      <Header />
      <Hero topStory={allTimeTop} />

      <main className="mx-auto max-w-[760px] px-[18px]">
        <Tabs view={view} range={range} />

        <TickerBar />

        {stories.length === 0 ? (
          <div className="text-center py-14">
            <p className="text-3xl mb-2">👻</p>
            <p className="text-ink text-[15px] mb-1">
              {range === "all" ? "ยังไม่มีเรื่องผีในชาร์ตเลย" : "ยังไม่มีเรื่องผีในช่วงเวลานี้"}
            </p>
            <p className="text-ink-faint text-sm">
              {range === "all"
                ? "วางลิงก์ YouTube ด้านบนเพื่อส่งเรื่องแรกเข้าชาร์ตได้เลย"
                : "ลองเปลี่ยนตัวกรองช่วงเวลาดู"}
            </p>
          </div>
        ) : (
          <>
            {isRankView && first && second && third && (
              <>
                <div className="flex items-center gap-2.5 bg-bg-2 border border-hairline rounded-lg px-4 py-3 mb-4">
                  <span
                    className="w-2 h-2 rounded-full bg-blood-bright shrink-0"
                    style={{ boxShadow: "0 0 8px var(--blood-bright)" }}
                    aria-hidden="true"
                  />
                  <p className="font-display font-black text-[22px] tracking-wide text-ink">
                    TOP 3 เรื่องหลอน
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.35fr_1fr] items-end gap-3 pb-7.5">
                  <div className="order-2 sm:order-1">
                    <PodiumCard story={second} rank={2} />
                  </div>
                  <div className="order-1 sm:order-2">
                    <PodiumCard story={first} rank={1} />
                  </div>
                  <div className="order-3">
                    <PodiumCard story={third} rank={3} />
                  </div>
                </div>
              </>
            )}

            <AffiliateRow title="สินค้าแนะนำ" items={AFF_ITEMS} />

            <FeaturedChannels channels={FEATURED_CHANNELS} />

            {(isRankView ? rest.length > 0 : stories.length > 0) && (
              <p className="font-display font-bold text-[17px] text-ink mb-2 mt-1">
                {isRankView ? "อันดับ 4-10" : "เรื่องล่าสุด"}
              </p>
            )}

            {(isRankView ? rest : stories).map((story, i) => {
              const rank = isRankView ? i + 4 : i + 1;
              // Only rank 4 gets the "gap to the podium" meter, measured
              // against rank 3's vote count.
              const gapToNext =
                isRankView && i === 0 && third
                  ? {
                      votes: Math.max(1, third.voteCount - story.voteCount + 1),
                      percent: Math.min(
                        95,
                        Math.round((story.voteCount / Math.max(1, third.voteCount)) * 100)
                      ),
                    }
                  : null;

              return (
                <StoryListItem
                  key={story.id}
                  story={story}
                  rank={rank}
                  gapToNext={gapToNext}
                />
              );
            })}

            <AdSlot />
          </>
        )}
      </main>

      <Footer />
      <TipFab />
    </QuickViewProvider>
  );
}
