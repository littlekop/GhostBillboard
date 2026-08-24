"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/deviceId";
import { getNickname } from "@/lib/nickname";
import { containsGamblingContent, containsProfanity, sanitizeMessage, MIN_MESSAGE_INTERVAL_MS } from "@/lib/moderation";

interface ChatMessage {
  id: string;
  nickname: string;
  body: string;
  deviceId: string;
}

export default function ChatPanel({ storyId }: { storyId: string }) {
  const [viewers, setViewers] = useState(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState("");
  const [nickname, setNickname] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const lastSentRef = useRef(0);
  const deviceId = useRef("");

  useEffect(() => {
    deviceId.current = getDeviceId();
    setNickname(getNickname());

    let cancelled = false;

    supabase
      .from("chat_messages")
      .select("id, nickname, body, device_id")
      .eq("story_id", storyId)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setMessages(
          data.map((m) => ({
            id: m.id,
            nickname: m.nickname,
            body: m.body,
            deviceId: m.device_id,
          }))
        );
      });

    // A fresh random key per mount (not the persisted device id) so
    // multiple tabs on the same browser each count as a separate viewer.
    const presenceKey = crypto.randomUUID();

    const channel = supabase
      .channel(`story:${storyId}`, {
        config: { presence: { key: presenceKey } },
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `story_id=eq.${storyId}` },
        (payload) => {
          const m = payload.new as {
            id: string;
            nickname: string;
            body: string;
            device_id: string;
          };
          setMessages((prev) =>
            prev.some((x) => x.id === m.id)
              ? prev
              : [...prev, { id: m.id, nickname: m.nickname, body: m.body, deviceId: m.device_id }]
          );
        }
      )
      .on("presence", { event: "sync" }, () => {
        setViewers(Math.max(1, Object.keys(channel.presenceState()).length));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") channel.track({ online_at: Date.now() });
      });

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [storyId]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  async function sendMessage() {
    const body = sanitizeMessage(input);
    if (!body) return;

    if (Date.now() - lastSentRef.current < MIN_MESSAGE_INTERVAL_MS) {
      setWarning("พิมพ์เร็วไปหน่อย รอแป๊บนึงนะ");
      return;
    }
    if (containsProfanity(body)) {
      setWarning("ข้อความมีคำไม่เหมาะสม ลองแก้ก่อนส่ง");
      return;
    }
    if (containsGamblingContent(body)) {
      setWarning("ห้ามส่งข้อความเกี่ยวกับการพนันหรือโฆษณาเว็บพนัน");
      return;
    }

    setWarning("");
    lastSentRef.current = Date.now();
    setInput("");

    const { error } = await supabase.from("chat_messages").insert({
      story_id: storyId,
      device_id: deviceId.current,
      nickname: nickname,
      body,
    });
    if (error) setWarning(error.message);
  }

  return (
    <div className="flex flex-col border border-hairline rounded-lg overflow-hidden bg-surface h-[420px] sm:h-[480px]">
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-hairline shrink-0">
        <span
          className="w-1.5 h-1.5 rounded-full bg-blood-bright shrink-0"
          style={{ boxShadow: "0 0 6px var(--blood-bright)" }}
          aria-hidden="true"
        />
        <span className="text-[15px] text-ink-dim">
          ร่วมฟังพร้อมกัน <b className="text-ink font-mono tabular-nums">{viewers.toLocaleString("th-TH")}</b> คน
        </span>
      </div>

      <div ref={bodyRef} className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5">
        {messages.length === 0 && (
          <p className="text-ink-faint text-xs text-center py-6">
            ยังไม่มีใครแชท เป็นคนแรกที่ทักได้เลย
          </p>
        )}
        {messages.map((m) => {
          const self = m.deviceId === deviceId.current;
          return (
            <div key={m.id} className={`text-sm ${self ? "text-right" : ""}`}>
              <span className={`text-xs font-semibold ${self ? "text-gold" : "text-ember"}`}>
                {m.nickname}
              </span>
              <p className={`text-ink leading-snug ${self ? "text-right" : ""}`}>{m.body}</p>
            </div>
          );
        })}
      </div>

      {warning && <p className="text-blood-bright text-xs px-3.5 pb-1">{warning}</p>}

      <div className="flex gap-2 p-2.5 border-t border-hairline shrink-0">
        <input
          className="flex-1 bg-bg-2 border border-hairline text-ink placeholder:text-ink-faint px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-ember"
          type="text"
          placeholder={`คุยในนาม ${nickname || "..."}`}
          value={input}
          maxLength={200}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          type="button"
          onClick={sendMessage}
          className="shrink-0 bg-blood border border-blood-bright text-[#fff2ea] rounded-lg px-4 text-sm font-semibold hover:brightness-110"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}
