"use client";

import { useEffect, useMemo, useState } from "react";

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 999 + salt * 37) * 10000;
  return x - Math.floor(x);
}

export default function BloodDrips({ count = 5 }: { count?: number }) {
  // Same client-only-mount reasoning as EmberField.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const drips = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: 8 + seeded(i, 11) * 84,
        height: 30 + seeded(i, 12) * 55,
        duration: 11 + seeded(i, 13) * 9,
        delay: seeded(i, 14) * 14,
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {drips.map((d, i) => (
        <span
          key={i}
          className="motion-safe-only absolute top-[-30px] w-[3px] rounded-b-[3px] animate-drip-fall
            after:content-[''] after:absolute after:-bottom-[3px] after:left-1/2 after:-translate-x-1/2
            after:w-[5px] after:h-[6px] after:rounded-[50%_50%_60%_60%] after:bg-blood-bright"
          style={{
            left: `${d.left}%`,
            height: d.height,
            background:
              "linear-gradient(180deg, transparent, var(--blood) 30%, var(--blood-bright) 90%)",
            opacity: 0.75,
            filter: "drop-shadow(0 0 3px rgba(196,53,58,0.35))",
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
