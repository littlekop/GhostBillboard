"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/deviceId";

const REASONS = ["ลิงก์เสีย / วิดีโอถูกลบ", "เนื้อหาไม่เหมาะสม", "อื่นๆ"];

export default function ReportButton({ storyId }: { storyId: string }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submitReport(reason: string) {
    setOpen(false);
    setError("");
    const { error: insertError } = await supabase.from("reports").insert({
      story_id: storyId,
      reason,
      reporter_id: getDeviceId(),
    });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return <span className="text-sm text-ink-faint">แจ้งแล้ว ขอบคุณ</span>;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-sm border border-hairline text-ink-dim rounded-full px-3 py-2 hover:border-blood-bright hover:text-blood-bright"
      >
        🚩 แจ้งปัญหา
      </button>
      {error && <p className="text-blood-bright text-xs mt-1">{error}</p>}
      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-surface border border-hairline rounded-lg overflow-hidden z-10 min-w-[200px]">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => submitReport(r)}
              className="block w-full text-left text-sm text-ink-dim px-3.5 py-2.5 hover:bg-bg-2 hover:text-ink"
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
