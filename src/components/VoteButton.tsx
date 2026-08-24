"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getDeviceId } from "@/lib/deviceId";

export default function VoteButton({
  storyId,
  size = "list",
}: {
  storyId: string;
  size?: "podium" | "podium-1" | "list";
}) {
  const [voted, setVoted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [justVoted, setJustVoted] = useState(false);

  useEffect(() => {
    const deviceId = getDeviceId();
    if (!deviceId) return;
    supabase
      .from("votes")
      .select("id")
      .eq("story_id", storyId)
      .eq("device_id", deviceId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setVoted(true);
      });
  }, [storyId]);

  async function handleVote() {
    if (voted || pending) return;
    setPending(true);
    setError("");
    const deviceId = getDeviceId();
    const { error: insertError } = await supabase
      .from("votes")
      .insert({ story_id: storyId, device_id: deviceId });

    setPending(false);
    // 23505 = unique_violation — device already voted for this story, which
    // is still a success state from the button's point of view.
    if (!insertError || insertError.code === "23505") {
      setVoted(true);
      setJustVoted(true);
      return;
    }
    setError(insertError.message);
    setTimeout(() => setError(""), 4000);
  }

  const sizeClass =
    size === "podium-1"
      ? "text-base px-5 py-2.5"
      : size === "podium"
        ? "text-sm px-4.5 py-2.5 w-full justify-center"
        : "text-[14px] px-3.5 py-2";

  return (
    <>
      <button
        type="button"
        onClick={handleVote}
        disabled={voted || pending}
        aria-pressed={voted}
        onAnimationEnd={() => setJustVoted(false)}
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full border transition-colors
          ${voted ? "bg-voted border-voted-bright text-[#eafff2]" : "bg-blood border-blood-bright text-[#fff2ea] hover:brightness-110"}
          ${justVoted ? "animate-vote-pop" : ""}
          disabled:opacity-80
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold
          ${sizeClass}`}
      >
        <span aria-hidden="true">👻</span>
        {voted ? "หลอนแล้ว" : "หลอนไหม?"}
      </button>
      {error && <span className="text-blood-bright text-[11px]">{error}</span>}
    </>
  );
}
