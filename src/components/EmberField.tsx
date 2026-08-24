"use client";

import { useEffect, useMemo, useState } from "react";

function seeded(i: number, salt: number) {
  const x = Math.sin(i * 999 + salt * 37) * 10000;
  return x - Math.floor(x);
}

export default function EmberField({ count = 20 }: { count?: number }) {
  // Random per-ember placement can't match between server and client render
  // passes, so this whole layer mounts client-only after hydration.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const embers = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: seeded(i, 1) * 100,
        size: 2 + seeded(i, 2) * 3,
        duration: 10 + seeded(i, 3) * 8,
        delay: seeded(i, 4) * 12,
        drift: (seeded(i, 5) - 0.5) * 50,
      })),
    [count]
  );

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-70"
      aria-hidden="true"
    >
      {embers.map((e, i) => (
        <span
          key={i}
          className="motion-safe-only absolute bottom-[-10px] rounded-full animate-ember-rise"
          style={
            {
              left: `${e.left}%`,
              width: e.size,
              height: e.size,
              background:
                "radial-gradient(circle, #ffb066 0%, var(--ember) 55%, transparent 80%)",
              animationDuration: `${e.duration}s`,
              animationDelay: `${e.delay}s`,
              "--drift": `${e.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
