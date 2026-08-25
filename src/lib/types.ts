export type Category =
  | "thai"
  | "real"
  | "possession"
  | "foreign"
  | "podcast";

export interface Story {
  id: string;
  youtubeId: string;
  slug: string;
  title: string;
  thumbnailUrl: string;
  channelName: string;
  description: string | null;
  category: Category;
  voteCount: number;
  createdAt: string; // ISO timestamp
}

export interface FeaturedChannel {
  name: string;
  desc: string;
  url: string;
}

export interface AffiliateItem {
  name: string;
  desc: string;
  emoji: string;
  color: string;
  url: string;
}
