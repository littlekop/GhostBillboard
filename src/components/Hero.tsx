"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { extractYoutubeId, fetchOEmbed, fetchVideoDescription } from "@/lib/youtube";
import { slugify, storyPath } from "@/lib/slug";
import { getDeviceId } from "@/lib/deviceId";
import { storyPath as buildStoryPath } from "@/lib/slug";
import type { Story } from "@/lib/types";
import { useQuickView } from "./QuickViewProvider";
import BloodDrips from "./BloodDrips";

type Preview = {
  youtubeId: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  existingStoryId: string | null;
};

export default function Hero({ topStory }: { topStory?: Story | null }) {
  const { open } = useQuickView();
  const router = useRouter();
  const [link, setLink] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPreview(null);

    const youtubeId = extractYoutubeId(link.trim());
    if (!youtubeId) {
      setError("ใส่ลิงก์ YouTube ให้ถูกต้องก่อนนะ");
      return;
    }

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("stories")
        .select("id, title, channel_name, thumbnail_url")
        .eq("youtube_id", youtubeId)
        .maybeSingle();

      if (existing) {
        setPreview({
          youtubeId,
          title: existing.title,
          channelName: existing.channel_name ?? "",
          thumbnailUrl:
            existing.thumbnail_url ?? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
          existingStoryId: existing.id,
        });
        return;
      }

      const info = await fetchOEmbed(youtubeId);
      if (!info) {
        setError("ดึงข้อมูลคลิปนี้ไม่ได้ ลองลิงก์อื่นดู");
        return;
      }
      setPreview({
        youtubeId,
        title: info.title,
        channelName: info.channelName,
        thumbnailUrl: info.thumbnailUrl,
        existingStoryId: null,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!preview) return;
    setSubmitting(true);
    setError("");

    if (preview.existingStoryId) {
      router.push(storyPath(slugify(preview.title), preview.existingStoryId));
      return;
    }

    const slug = slugify(preview.title);
    const description = await fetchVideoDescription(preview.youtubeId);
    const { data, error: insertError } = await supabase
      .from("stories")
      .insert({
        youtube_id: preview.youtubeId,
        title: preview.title,
        slug,
        thumbnail_url: preview.thumbnailUrl,
        channel_name: preview.channelName,
        description,
        device_id: getDeviceId(),
      })
      .select("id")
      .single();

    setSubmitting(false);
    if (insertError || !data) {
      setError(insertError?.message || "ส่งเรื่องไม่สำเร็จ ลองใหม่อีกครั้ง");
      return;
    }
    router.push(storyPath(slug, data.id));
  }

  return (
    <section className="relative overflow-hidden border-b border-hairline pt-11 pb-7">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <span
          className="motion-safe-only absolute flex gap-2.5 opacity-55"
          style={{ top: "18%", left: "6%" }}
        >
          <Eye />
          <Eye />
        </span>
        <span
          className="motion-safe-only absolute flex gap-2.5 opacity-55"
          style={{ top: "60%", left: "90%" }}
        >
          <Eye />
          <Eye />
        </span>
      </div>
      <BloodDrips />

      <div className="relative mx-auto max-w-[760px] px-[18px] grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6 lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="font-mono text-xs tracking-[0.14em] uppercase text-ember mb-2.5">
            ชาร์ตเรื่องผีติดอันดับสำหรับคุณ
          </p>
          <h1 className="font-display font-black text-[clamp(30px,6vw,42px)] leading-[1.15] mb-3 text-balance text-ink">
            วางลิงก์ <em className="not-italic text-blood-bright">YouTube</em>{" "}
            โหวตให้<em className="not-italic text-blood-bright">เรื่องหลอน</em>
            ที่สุดขึ้นอันดับ 1
          </h1>
          <p className="text-ink-dim max-w-[46ch] mb-6 text-[15.5px]">
            ไม่ต้องสมัครสมาชิก ดูคลิปในหน้าเว็บได้เลย พร้อมแชทลุ้นไปด้วยกันตอนดึก
          </p>

          <form className="flex gap-2 max-w-[520px] relative z-[1]" onSubmit={handleCheck}>
            <input
              className="flex-1 bg-surface border border-hairline text-ink placeholder:text-ink-faint px-3.5 py-3 rounded-lg text-[14.5px] outline-none focus:ring-2 focus:ring-ember"
              type="text"
              placeholder="วางลิงก์ YouTube เรื่องผีของคุณที่นี่..."
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                setPreview(null);
                setError("");
              }}
            />
            <button
              type="submit"
              disabled={loading}
              className="font-display font-bold text-[15px] bg-blood text-[#fff2ea] border border-blood-bright px-5 rounded-lg hover:brightness-110 disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบลิงก์"}
            </button>
          </form>

          {error && <p className="text-blood-bright text-sm mt-3 relative z-[1]">{error}</p>}

          {preview && (
            <div className="relative z-[1] mt-4 max-w-[520px] flex gap-3 items-center bg-surface border border-hairline rounded-lg p-3">
              <div className="relative w-20 aspect-video rounded overflow-hidden shrink-0 bg-black">
                <Image
                  src={preview.thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink leading-snug line-clamp-2">{preview.title}</p>
                <p className="text-xs text-ink-faint mt-0.5">{preview.channelName}</p>
                {preview.existingStoryId && (
                  <p className="text-xs text-gold mt-1">มีเรื่องนี้อยู่แล้ว — โหวตให้แทนได้เลย</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={submitting}
                className="shrink-0 font-display font-semibold text-[13px] bg-blood text-[#fff2ea] border border-blood-bright px-4 py-2 rounded-full hover:brightness-110 disabled:opacity-70"
              >
                {submitting
                  ? "กำลังส่ง..."
                  : preview.existingStoryId
                    ? "โหวตให้เรื่องนี้"
                    : "ส่งเข้าชาร์ต"}
              </button>
            </div>
          )}
        </div>

        {topStory && (
          <a
            href={buildStoryPath(topStory.slug, topStory.id)}
            onClick={(e) => {
              e.preventDefault();
              open(topStory);
            }}
            className="order-1 lg:order-2 relative z-[1] block mx-auto lg:mx-0 w-[190px] rotate-[-3deg] hover:rotate-0 transition-transform duration-300"
          >
            <div
              className="rounded-xl border border-gold-dim overflow-hidden bg-black"
              style={{ boxShadow: "0 22px 44px -18px rgba(212,169,79,0.45)" }}
            >
              <div className="relative aspect-video">
                <Image
                  src={topStory.thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover opacity-90"
                  sizes="190px"
                />
                <span className="absolute top-1.5 left-1.5 font-display font-black text-xs bg-gold text-bg rounded px-1.5 py-0.5">
                  #1 ตอนนี้
                </span>
              </div>
              <div className="bg-surface px-2.5 py-2">
                <p className="text-[11.5px] text-ink leading-snug line-clamp-2 mb-1">
                  {topStory.title}
                </p>
                <p className="font-mono text-[11px] text-gold">
                  {topStory.voteCount.toLocaleString("th-TH")} โหวต
                </p>
              </div>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}

function Eye() {
  return (
    <span
      className="w-[5px] h-[5px] rounded-full bg-ember"
      style={{ boxShadow: "0 0 8px 2px rgba(224,129,44,0.7)" }}
    />
  );
}
