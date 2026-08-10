import { useCallback, useState } from "react";
import MediaGrid from "../components/media/MediaGrid";
import useFetch from "../hooks/useFetch";
import { getTrending } from "../services/tmdbApi";

const windows = [
  { value: "day", label: "Today" },
  { value: "week", label: "This week" },
];

function Home() {
  const [timeWindow, setTimeWindow] = useState("week");

  const fetcher = useCallback(
    (options) => getTrending("all", timeWindow, options),
    [timeWindow],
  );

  const { data, loading, error } = useFetch(fetcher, [timeWindow]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-sora text-3xl font-semibold leading-10 text-ink">
            Trending
          </h1>
          <p className="text-sm text-ink-subtle">
            What people are watching right now.
          </p>
        </div>
        <div
          role="group"
          aria-label="Time window"
          className="flex gap-1 rounded-full border border-border/50 bg-surface p-1"
        >
          {windows.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTimeWindow(option.value)}
              aria-pressed={timeWindow === option.value}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                timeWindow === option.value
                  ? "bg-brand text-canvas"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <MediaGrid
        items={data?.results}
        loading={loading}
        error={error}
        emptyMessage="No trending titles right now."
      />
    </div>
  );
}

export default Home;
