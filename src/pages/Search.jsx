import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MediaCard from "../components/media/MediaCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useDebounce from "../hooks/useDebounce";
import useFetch from "../hooks/useFetch";
import { discoverByGenre, imageUrl, searchMulti } from "../services/tmdbApi";

const mediaFilters = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
];

const genres = [
  {
    value: "action",
    label: "Action",
    image: "/search/action.png",
  },
  {
    value: "comedy",
    label: "Comedy",
    image: "/search/comedy.png",
  },
  {
    value: "drama",
    label: "Drama",
    image: "/search/drama.png",
  },
  {
    value: "science fiction",
    label: "Sci-fi",
    image: "/search/scifi.png",
  },
];

const recommendationCards = [
  { label: "Aetheria Chronicles", image: "/search/aetheria.png" },
  { label: "Neon Shadows", image: "/search/neon-shadows.png" },
  { label: "Azure Peaks", image: "/search/azure-peaks.png" },
  { label: "Vector Pulse", image: "/search/vector-pulse.png" },
  { label: "Neural Mesh", image: "/search/neural-mesh.png" },
];

function SearchIcon({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="20"
      viewBox="0 0 24 24"
      width="20"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 24 24"
      width="14"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
    >
      <path
        d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [mediaType, setMediaType] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const debouncedQuery = useDebounce(query.trim(), 500);
  const hasQuery = Boolean(debouncedQuery || selectedGenre);

  const fetcher = useCallback(
    (options) => {
      if (selectedGenre) {
        return discoverByGenre(selectedGenre.value, mediaType, options);
      }
      if (!debouncedQuery) return Promise.resolve({ results: [] });
      return searchMulti(debouncedQuery, 1, options);
    },
    [debouncedQuery, mediaType, selectedGenre],
  );

  const { data, loading, error, reload } = useFetch(fetcher, [
    debouncedQuery,
    mediaType,
    selectedGenre,
  ]);

  const results = useMemo(() => {
    const items = data?.results || [];
    if (mediaType === "all") {
      return items.filter((item) => item.media_type !== "person");
    }
    return items.filter((item) => item.media_type === mediaType);
  }, [data?.results, mediaType]);

  function updateQuery(value) {
    setSelectedGenre(null);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }

  function chooseGenre(genre) {
    setSelectedGenre(genre);
    setMediaType("all");
    setShowGenreMenu(false);
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  }

  const resultLabel = mediaType === "person" ? "people" : "titles";
  const resultQuery = selectedGenre?.label || debouncedQuery;

  return (
    <div className="mx-auto flex w-full max-w-[976px] flex-col gap-8">
      <section className="flex flex-col gap-4" aria-labelledby="search-heading">
        <h1 id="search-heading" className="sr-only">
          Search Xplorem
        </h1>
        <label className="relative mx-auto flex h-[70px] w-full max-w-[768px] items-center rounded-full border border-border/50 bg-surface px-6 shadow-[0_12px_36px_rgba(0,0,0,0.18)] focus-within:border-brand">
          <SearchIcon className="mr-4 shrink-0 text-ink-subtle" />
          <input
            aria-label="Search titles, actors, or genres"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent font-sora text-lg text-ink outline-none placeholder:text-ink-subtle sm:text-xl"
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="Search titles, actors, or genres"
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Clear search"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-xl leading-none text-ink-subtle transition-colors hover:bg-surface-raised hover:text-ink"
              onClick={() => updateQuery("")}
              type="button"
            >
              <span aria-hidden="true">×</span>
            </button>
          )}
        </label>

        <div
          className="flex flex-wrap items-center gap-3"
          role="group"
          aria-label="Search filters"
        >
          {mediaFilters.map((filter) => (
            <button
              aria-pressed={mediaType === filter.value}
              className={`h-[38px] rounded-full border px-6 text-sm font-bold transition-colors ${
                mediaType === filter.value
                  ? "border-brand bg-brand text-canvas"
                  : "border-border/50 bg-surface text-ink-muted hover:border-brand/50 hover:text-ink"
              }`}
              key={filter.value}
              onClick={() => setMediaType(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
          <div className="relative">
            <button
              aria-expanded={showGenreMenu}
              className="flex h-[38px] items-center gap-2 rounded-full border border-border/50 bg-surface px-6 text-sm font-bold text-ink-muted transition-colors hover:border-brand/50 hover:text-ink"
              onClick={() => setShowGenreMenu((visible) => !visible)}
              type="button"
            >
              Genres
              <ChevronDownIcon />
            </button>
            {showGenreMenu && (
              <div
                className="absolute left-0 top-11 z-20 min-w-40 rounded-xl border border-border/50 bg-surface p-1.5 shadow-2xl"
                role="menu"
              >
                {genres.map((genre) => (
                  <button
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-ink-muted hover:bg-surface-raised hover:text-ink"
                    key={genre.value}
                    onClick={() => chooseGenre(genre)}
                    role="menuitem"
                    type="button"
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            aria-pressed={mediaType === "person"}
            className={`h-[38px] rounded-full border px-6 text-sm font-bold transition-colors ${
              mediaType === "person"
                ? "border-brand bg-brand text-canvas"
                : "border-border/50 bg-surface text-ink-muted hover:border-brand/50 hover:text-ink"
            }`}
            onClick={() => {
              setSelectedGenre(null);
              setMediaType("person");
            }}
            type="button"
          >
            Actors
          </button>
        </div>
      </section>

      {hasQuery ? (
        <section className="flex flex-col gap-6" aria-live="polite">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-sora text-2xl font-semibold text-ink sm:text-3xl">
                Search results
              </h2>
              <p className="mt-1 text-sm text-ink-subtle">
                {loading
                  ? `Finding ${resultLabel}...`
                  : `${results.length} ${resultLabel} for “${resultQuery}”`}
              </p>
            </div>
            {!loading && !error && data?.total_results > results.length && (
              <span className="font-mono text-xs uppercase text-ink-faint">
                Showing first page
              </span>
            )}
          </div>

          {loading ? (
            <LoadingSpinner
              size="lg"
              className="py-16"
              label="Searching titles"
            />
          ) : error ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p role="alert" className="text-sm text-danger">
                {error.message}
              </p>
              <button
                className="rounded-full border border-border/50 bg-surface px-4 py-2 text-sm font-bold text-ink-muted hover:bg-surface-raised hover:text-ink"
                onClick={reload}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : results.length ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((item) => (
                <li key={`${item.media_type || "media"}-${item.id}`}>
                  {item.media_type === "person" ? (
                    <PersonCard item={item} />
                  ) : (
                    <MediaCard item={item} />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <p className="font-sora text-lg font-semibold text-ink">
                No titles found
              </p>
              <p className="text-sm text-ink-subtle">
                Try a different title, actor, or genre.
              </p>
            </div>
          )}
        </section>
      ) : (
        <section
          className="flex flex-col gap-8"
          aria-labelledby="recommended-heading"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                id="recommended-heading"
                className="font-sora text-2xl font-semibold text-ink sm:text-3xl"
              >
                Recommended for you
              </h2>
              <p className="mt-1 text-sm text-ink-subtle">
                Start with something people are talking about.
              </p>
            </div>
            <span className="hidden font-mono text-xs uppercase text-ink-faint sm:block">
              Explore
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {recommendationCards.map((card) => (
              <RecommendationCard key={card.label} {...card} />
            ))}
          </div>

          <div className="flex flex-col gap-8" aria-labelledby="genres-heading">
            <h2
              id="genres-heading"
              className="font-sora text-2xl font-semibold text-ink sm:text-3xl"
            >
              Browse genres
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {genres.map((genre) => (
                <button
                  className="group relative flex h-32 items-end overflow-hidden rounded-xl border border-border/50 bg-surface p-4 text-left transition-transform hover:-translate-y-1 hover:border-brand/50"
                  key={genre.value}
                  onClick={() => chooseGenre(genre)}
                  type="button"
                >
                  <img
                    alt=""
                    className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
                    src={genre.image}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-canvas/20 to-transparent" />
                  <span className="relative font-sora text-xl font-semibold text-ink transition-colors group-hover:text-brand">
                    {genre.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function RecommendationCard({ image, label }) {
  return (
    <div className="group flex flex-col gap-3">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border/30 bg-surface">
        <img
          alt=""
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="rounded-full border border-white/20 bg-canvas/50 px-2 py-1 font-mono text-xs text-star backdrop-blur-sm">
            ★ 8.2
          </span>
          <BookmarkIcon />
        </div>
      </div>
      <h3 className="font-sora text-sm font-bold leading-tight text-ink group-hover:text-brand">
        {label}
      </h3>
      <p className="font-mono text-xs uppercase text-ink-faint">2024 · movie</p>
    </div>
  );
}

function PersonCard({ item }) {
  const profile = imageUrl(item.profile_path, "w342");

  return (
    <article className="group flex flex-col gap-2">
      <div className="aspect-[2/3] overflow-hidden rounded-xl border border-border/30 bg-surface">
        {profile ? (
          <img
            alt=""
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            src={profile}
          />
        ) : (
          <div className="flex size-full items-center justify-center p-4 text-center font-mono text-xs text-ink-subtle">
            No profile image
          </div>
        )}
      </div>
      <h3 className="line-clamp-2 font-sora text-sm font-bold leading-tight text-ink">
        {item.name}
      </h3>
      <p className="font-mono text-xs uppercase text-ink-faint">Actor</p>
    </article>
  );
}

export default Search;
