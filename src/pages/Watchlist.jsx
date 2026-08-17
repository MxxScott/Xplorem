import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiBookmark } from "react-icons/fi";
import MediaGrid from "../components/media/MediaGrid";
import useWatchlist from "../hooks/useWatchlist";

const filters = [
  { value: "all", label: "Everything" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV shows" },
];

function Watchlist() {
  const { items } = useWatchlist();
  const [mediaType, setMediaType] = useState("all");

  const visibleItems = useMemo(
    () =>
      mediaType === "all"
        ? items
        : items.filter((item) => item.media_type === mediaType),
    [items, mediaType],
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
      <header className="flex flex-col gap-6 border-b border-border/30 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-wider text-brand">
            Your saved titles
          </p>
          <h1 className="font-sora text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Library
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-ink-subtle sm:text-base">
            Keep the films and series you want to come back to in one calm,
            personal queue.
          </p>
        </div>
        <div className="flex items-baseline gap-2 font-mono text-xs uppercase text-ink-faint">
          <span className="text-3xl font-bold text-brand">{items.length}</span>
          <span>{items.length === 1 ? "title saved" : "titles saved"}</span>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter library"
          className="flex gap-1 rounded-full border border-border/50 bg-surface p-1"
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={mediaType === filter.value}
              onClick={() => setMediaType(filter.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                mediaType === filter.value
                  ? "bg-brand text-canvas"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        {items.length > 0 && (
          <p className="font-mono text-xs uppercase text-ink-faint">
            {visibleItems.length} shown
          </p>
        )}
      </div>

      {visibleItems.length > 0 ? (
        <MediaGrid
          items={visibleItems}
          emptyMessage="No titles in this filter."
        />
      ) : items.length > 0 ? (
        <section className="flex flex-col items-center gap-3 py-20 text-center">
          <p className="font-sora text-xl font-semibold text-ink">
            Nothing here yet
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-ink-subtle">
            Save a few {mediaType === "movie" ? "movies" : "TV shows"} and they
            will appear in this view.
          </p>
        </section>
      ) : (
        <section className="flex flex-col items-center gap-5 border-y border-border/30 py-20 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand">
            <FiBookmark aria-hidden="true" size={28} />
          </span>
          <div className="flex max-w-md flex-col gap-2">
            <h2 className="font-sora text-2xl font-semibold text-ink">
              Your queue starts here
            </h2>
            <p className="text-sm leading-relaxed text-ink-subtle">
              Tap the bookmark on any title that catches your eye. Your saved
              picks stay on this device and are ready whenever you are.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-canvas transition-colors hover:bg-brand-bright"
            >
              Browse trending
            </Link>
            <Link
              to="/search"
              className="rounded-full border border-border/50 bg-surface px-5 py-2.5 text-sm font-bold text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
            >
              Search the catalogue
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

export default Watchlist;
