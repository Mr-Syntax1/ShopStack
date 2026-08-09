import { liveEvents } from "@/lib/mock-data";

export default function LiveTicker() {
  const items = [...liveEvents, ...liveEvents];

  return (
    <div className="flex items-center gap-3 overflow-hidden rounded-full border border-line bg-surface pl-4 pr-1 py-1.5">
      <span className="flex shrink-0 items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-indigo-700">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-600" />
        </span>
        Live
      </span>
      <div className="h-4 w-px shrink-0 bg-line" />
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker-track flex w-max gap-10 whitespace-nowrap">
          {items.map((event, i) => (
            <span key={i} className="text-[12.5px] text-ink-soft">
              {event}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
