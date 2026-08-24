import Link from "next/link";
import type { RangeId, ViewMode } from "@/lib/data";

const VIEW_OPTIONS: { id: ViewMode; label: string }[] = [
  { id: "rank", label: "หลอนที่สุด" },
  { id: "latest", label: "ล่าสุด" },
];

const RANGE_OPTIONS: { id: RangeId; label: string }[] = [
  { id: "today", label: "วันนี้" },
  { id: "week", label: "สัปดาห์นี้" },
  { id: "all", label: "ตลอดกาล" },
];

function hrefFor(view: ViewMode, range: RangeId) {
  const params = new URLSearchParams();
  if (view !== "rank") params.set("view", view);
  if (range !== "all") params.set("range", range);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default function Tabs({
  view,
  range,
}: {
  view: ViewMode;
  range: RangeId;
}) {
  return (
    <div className="pt-5 pb-4">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="inline-flex bg-bg-2 border border-hairline rounded-full p-[3px] gap-0.5">
          {VIEW_OPTIONS.map((o) => (
            <Link
              key={o.id}
              href={hrefFor(o.id, range)}
              className={`text-[13.5px] font-semibold px-3.5 py-2.5 rounded-full ${
                o.id === view
                  ? "bg-surface-2 text-ink"
                  : "text-ink-faint"
              } ${o.id === "rank" && o.id === view ? "text-gold" : ""}`}
            >
              {o.label}
            </Link>
          ))}
        </div>
        <div className="inline-flex bg-bg-2 border border-hairline rounded-full p-[3px] gap-0.5">
          {RANGE_OPTIONS.map((o) => (
            <Link
              key={o.id}
              href={hrefFor(view, o.id)}
              className={`text-[13.5px] font-semibold px-3.5 py-2.5 rounded-full ${
                o.id === range ? "bg-surface-2 text-ink" : "text-ink-faint"
              }`}
            >
              {o.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
