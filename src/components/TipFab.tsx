"use client";

import { useState } from "react";
import Image from "next/image";

export default function TipFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-4.5 bottom-4.5 z-[15] bg-surface-2 border border-gold-dim text-gold rounded-full px-4 py-2.5 text-sm font-semibold"
        style={{ boxShadow: "0 8px 24px -10px rgba(0,0,0,0.6)" }}
      >
        ☕ เลี้ยงกาแฟแอดมิน
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-surface border border-hairline rounded-xl p-5 max-w-[320px] w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-display font-bold text-lg text-ink mb-1">เลี้ยงกาแฟแอดมิน</p>
            <p className="text-sm text-ink-dim mb-4">ขอบคุณที่ร่วมสนับสนุนครับ</p>
            <div className="rounded-lg overflow-hidden border border-hairline">
              <Image
                src="/tip-qr.jpg"
                alt="QR code สำหรับเลี้ยงกาแฟแอดมิน"
                width={600}
                height={800}
                className="w-full h-auto"
              />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 text-sm text-ink-faint hover:text-ink"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </>
  );
}
