import { supabase } from "./supabase";
import type { AffiliateItem, Category, FeaturedChannel, Story } from "./types";

interface StoryRow {
  id: string;
  youtube_id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  channel_name: string | null;
  category: string | null;
  vote_count: number;
  created_at: string;
}

function fromRow(row: StoryRow): Story {
  return {
    id: row.id,
    youtubeId: row.youtube_id,
    slug: row.slug,
    title: row.title,
    thumbnailUrl: row.thumbnail_url ?? `https://i.ytimg.com/vi/${row.youtube_id}/hqdefault.jpg`,
    channelName: row.channel_name ?? "",
    category: (row.category ?? "thai") as Category,
    voteCount: row.vote_count,
    createdAt: row.created_at,
  };
}

export type ViewMode = "rank" | "latest";
export type RangeId = "today" | "week" | "all";

const RANGE_HOURS: Record<RangeId, number | null> = {
  today: 24,
  week: 7 * 24,
  all: null,
};

export async function getStories(opts?: {
  view?: ViewMode;
  range?: RangeId;
}): Promise<Story[]> {
  const view = opts?.view ?? "rank";
  const range = opts?.range ?? "all";

  let query = supabase.from("stories").select("*");

  const hours = RANGE_HOURS[range];
  if (hours !== null) {
    const cutoff = new Date(Date.now() - hours * 3600 * 1000).toISOString();
    query = query.gte("created_at", cutoff);
  }

  query =
    view === "latest"
      ? query.order("created_at", { ascending: false })
      : query.order("vote_count", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  return (data as StoryRow[]).map(fromRow);
}

export async function getStoryById(id: string): Promise<Story | null> {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? fromRow(data as StoryRow) : null;
}

// Highest-voted stories other than the one being viewed — keeps people
// browsing after a clip ends instead of just closing the tab.
export async function getRelatedStories(excludeId: string, limit = 4): Promise<Story[]> {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .neq("id", excludeId)
    .order("vote_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data as StoryRow[]).map(fromRow);
}

export const FEATURED_CHANNELS: FeaturedChannel[] = [
  {
    name: "The Ghost Radio",
    desc: "คลื่นสยองของคนรุ่นใหม่ — ช่องเล่าเรื่องผีที่คนไทยรู้จักกันแทบทุกบ้าน",
    url: "https://www.facebook.com/theghostradio",
  },
  {
    name: "The Shock",
    desc: 'ช่องเล่าเรื่องผีสุดสยอง เจ้าของเรื่องดัง "ธี่หยด" ที่ถูกสร้างเป็นหนังฉาย Netflix',
    url: "https://www.youtube.com/@TheShock13",
  },
];

export const AFF_ITEMS: AffiliateItem[] = [
  {
    name: "เสื้อยืด Hobs x Ghost Radio",
    desc: "คอลเลกชัน 13 Ghost ของแท้ ร่วมกับ The Ghost Radio",
    emoji: "👕",
    color: "#241619",
    url: "https://s.shopee.co.th/8Koy4fZ1Ko",
  },
  {
    name: "หูฟัง HUAWEI FreeBuds SE 4",
    desc: "หูฟังตัดเสียงรบกวน ฟังพอดแคสต์ผีได้หลอนกว่าเดิม",
    emoji: "🎧",
    color: "#2a1c1f",
    url: "https://s.shopee.co.th/7pshTqUAYm",
  },
  {
    name: "บิสกิต VFOODS",
    desc: "ขนมเคี้ยวเพลิน อยู่ฟังเรื่องผีได้ยาวๆ",
    emoji: "🍪",
    color: "#241a15",
    url: "https://s.shopee.co.th/2VrB89ehaN",
  },
  {
    name: "ตะวัน แพ็ค 12",
    desc: "ตะวันยกแพ็ค แชร์กับเพื่อนได้ทั้งแก๊งค์",
    emoji: "🥟",
    color: "#1d2418",
    url: "https://s.shopee.co.th/8V8OHBy4Qh",
  },
  {
    name: "หมอน TOTORI คลาวด์",
    desc: "หมอนนุ่มจนลืมกลัวผี",
    emoji: "☁️",
    color: "#1a1a24",
    url: "https://s.shopee.co.th/1VydwMx6o3",
  },
  {
    name: "ซาวด์บาร์ d-power M-500",
    desc: "บลูทูธ 5.0 ฟังคลิปผีชัดกว่าเดิม",
    emoji: "🔊",
    color: "#161b22",
    url: "https://s.shopee.co.th/40fyv4CBWC",
  },
];
