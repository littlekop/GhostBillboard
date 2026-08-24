"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/deviceId";
import { containsGamblingContent, containsProfanity } from "@/lib/moderation";

interface UserStory {
  id: string;
  authorName: string | null;
  body: string;
  createdAt: string;
}

const MIN_LENGTH = 10;
const MAX_LENGTH = 2000;
const MIN_SUBMIT_INTERVAL_MS = 15000;

export default function UserStorySection() {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const lastSubmitRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("user_stories")
      .select("id, author_name, body, created_at")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setStories(
          data.map((r) => ({
            id: r.id,
            authorName: r.author_name,
            body: r.body,
            createdAt: r.created_at,
          }))
        );
      });

    const channel = supabase
      .channel("user-stories-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_stories" },
        (payload) => {
          const r = payload.new as {
            id: string;
            author_name: string | null;
            body: string;
            created_at: string;
          };
          setStories((prev) =>
            prev.some((s) => s.id === r.id)
              ? prev
              : [{ id: r.id, authorName: r.author_name, body: r.body, createdAt: r.created_at }, ...prev].slice(0, 20)
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const text = body.trim();
    if (text.length < MIN_LENGTH) {
      setError(`เล่าให้ยาวกว่านี้อีกหน่อยนะ (อย่างน้อย ${MIN_LENGTH} ตัวอักษร)`);
      return;
    }
    if (text.length > MAX_LENGTH) {
      setError(`เรื่องยาวไปหน่อย ตัดให้เหลือไม่เกิน ${MAX_LENGTH} ตัวอักษร`);
      return;
    }
    if (containsProfanity(text) || containsProfanity(authorName)) {
      setError("เนื้อหามีคำไม่เหมาะสม ลองแก้ก่อนส่ง");
      return;
    }
    if (containsGamblingContent(text) || containsGamblingContent(authorName)) {
      setError("ห้ามโพสต์เนื้อหาเกี่ยวกับการพนันหรือโฆษณาเว็บพนัน");
      return;
    }
    if (Date.now() - lastSubmitRef.current < MIN_SUBMIT_INTERVAL_MS) {
      setError("ส่งถี่ไปหน่อย รอสักครู่แล้วลองใหม่");
      return;
    }

    setSubmitting(true);
    lastSubmitRef.current = Date.now();

    const { error: insertError } = await supabase.from("user_stories").insert({
      author_name: authorName.trim() || null,
      body: text,
      device_id: getDeviceId(),
    });

    setSubmitting(false);
    if (insertError) {
      setError(insertError.message || "ส่งเรื่องไม่สำเร็จ ลองใหม่อีกครั้ง");
      return;
    }
    setBody("");
    setAuthorName("");
  }

  return (
    <div className="my-2 mb-7">
      <p className="font-display font-bold text-[17px] text-ink mb-1">เรื่องผีที่คุณอยากเล่า</p>
      <p className="text-[13px] text-ink-faint mb-3">
        ไม่มีคลิป ไม่เป็นไร พิมพ์เล่าเรื่องหลอนของคุณเองได้เลย ใส่ชื่อเจ้าของเรื่องหรือจะไม่ระบุตัวตนก็ได้
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mb-5">
        <input
          className="bg-surface border border-hairline text-ink placeholder:text-ink-faint px-3.5 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-ember"
          type="text"
          placeholder="ชื่อเจ้าของเรื่อง (ไม่ใส่ก็ได้)"
          value={authorName}
          maxLength={60}
          onChange={(e) => setAuthorName(e.target.value)}
        />
        <textarea
          className="bg-surface border border-hairline text-ink placeholder:text-ink-faint px-3.5 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-ember resize-y min-h-[110px]"
          placeholder="เล่าเรื่องผีของคุณที่นี่..."
          value={body}
          maxLength={MAX_LENGTH}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-ink-faint">
            {body.length}/{MAX_LENGTH}
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="font-display font-bold text-sm bg-blood text-[#fff2ea] border border-blood-bright px-5 py-2 rounded-lg hover:brightness-110 disabled:opacity-70"
          >
            {submitting ? "กำลังส่ง..." : "ส่งเรื่องเล่า"}
          </button>
        </div>
        {error && <p className="text-blood-bright text-sm">{error}</p>}
      </form>

      {stories.length === 0 ? (
        <p className="text-ink-faint text-sm text-center py-4">ยังไม่มีใครเล่าเรื่องผี เป็นคนแรกได้เลย</p>
      ) : (
        <div className="flex flex-col gap-3">
          {stories.map((s) => (
            <div key={s.id} className="border border-hairline rounded-lg p-3.5 bg-surface">
              <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{s.body}</p>
              <p className="text-xs text-ink-faint mt-2">
                — {s.authorName || "ไม่ระบุชื่อ"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
