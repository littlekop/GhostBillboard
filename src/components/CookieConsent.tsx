"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const STORAGE_KEY = "ghostbillboard-consent";

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function respond(granted: boolean) {
    const state = granted ? "granted" : "denied";
    gtag("consent", "update", {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    });
    localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-surface px-4 py-4"
      style={{ boxShadow: "0 -8px 24px -10px rgba(0,0,0,0.5)" }}
      role="dialog"
      aria-live="polite"
      aria-label="การใช้คุกกี้"
    >
      <div className="mx-auto max-w-[760px] flex flex-col sm:flex-row items-center gap-3.5">
        <p className="text-[13px] text-ink-dim leading-relaxed flex-1">
          เว็บนี้ใช้คุกกี้เพื่อวิเคราะห์การใช้งานและแสดงโฆษณาที่เหมาะสม อ่านรายละเอียดที่{" "}
          <a href="/privacy" className="text-ember hover:underline">
            นโยบายความเป็นส่วนตัว
          </a>
        </p>
        <div className="flex gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => respond(false)}
            className="text-sm text-ink-faint hover:text-ink px-3 py-2"
          >
            ปฏิเสธ
          </button>
          <button
            type="button"
            onClick={() => respond(true)}
            className="text-sm font-semibold text-bg bg-ember rounded-lg px-4 py-2 hover:bg-ember/90"
          >
            ยอมรับ
          </button>
        </div>
      </div>
    </div>
  );
}
