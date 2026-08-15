import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiX,
} from "react-icons/fi";
import MediaCard from "../components/media/MediaCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useDebounce from "../hooks/useDebounce";
import useFetch from "../hooks/useFetch";
import {
  discoverByGenre,
  getTrending,
  imageUrl,
  searchMovies,
  searchMulti,
  searchPeople,
  searchTv,
} from "../services/tmdbApi";

const mediaFilters = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
];

const genres = [
  { value: "action", label: "Action" },
  { value: "comedy", label: "Comedy" },
  { value: "drama", label: "Drama" },
  { value: "science fiction", label: "Sci-fi" },
];

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const requestedPage = Number(searchParams.get("page"));
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const [mediaType, setMediaType] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const debouncedQuery = useDebounce(query.trim(), 500);
  const hasQuery = Boolean(debouncedQuery || selectedGenre);

  const landingFetcher = useCallback(async (options) => {
    const [trending, ...genreResponses] = await Promise.all([
      getTrending("all", "week", options),
      ...genres.map((genre) => discoverByGenre(genre.value, "all", 1, options)),
    ]);

    return {
      recommendations: (trending.results || [])
        .filter((item) => item.media_type !== "person" && item.poster_path)
        .slice(0, 5),
      genreHighlights: genreResponses.map((response, index) => ({
        ...genres[index],
        item: (response.results || []).find(
          (item) => item.backdrop_path || item.poster_path,
        ),
      })),
    };
  }, []);

  const {
    data: landingData,
    loading: landingLoading,
    error: landingError,
    reload: reloadLanding,
  } = useFetch(landingFetcher, []);

  const fetcher = useCallback(
    (options) => {
      if (selectedGenre) {
        return discoverByGenre(
          selectedGenre.value,
          mediaType,
          currentPage,
          options,
        );
      }
      if (!debouncedQuery) return Promise.resolve({ results: [] });
      if (mediaType === "movie") {
        return searchMovies(debouncedQuery, currentPage, options);
      }
      if (mediaType === "tv") {
        return searchTv(debouncedQuery, currentPage, options);
      }
      if (mediaType === "person") {
        return searchPeople(debouncedQuery, currentPage, options);
      }
      return searchMulti(debouncedQuery, currentPage, options);
    },
    [currentPage, debouncedQuery, mediaType, selectedGenre],
  );

  const { data, loading, error, reload } = useFetch(fetcher, [
    debouncedQuery,
    mediaType,
    selectedGenre,
    currentPage,
  ]);

  const results = useMemo(() => {
    const items = data?.results || [];
    return mediaType === "all"
      ? items
      : items.filter((item) => item.media_type === mediaType);
  }, [data?.results, mediaType]);

  const totalPages = Math.max(1, data?.total_pages || 1);

  function updateQuery(value) {
    setSelectedGenre(null);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("q", value);
    else next.delete("q");
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  function chooseGenre(genre) {
    setSelectedGenre(genre);
    setMediaType("all");
    setShowGenreMenu(false);
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  function changeMediaType(nextMediaType) {
    setSelectedGenre(null);
    setMediaType(nextMediaType);
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  function changePage(nextPage) {
    const page = Math.max(1, Math.min(nextPage, totalPages));
    const next = new URLSearchParams(searchParams);
    if (page === 1) next.delete("page");
    else next.set("page", String(page));
    setSearchParams(next);
  }

  const resultLabel =
    mediaType === "person"
      ? "people"
      : mediaType === "all"
        ? "results"
        : "titles";
  const resultQuery = selectedGenre?.label || debouncedQuery;

  return (
    <div className="mx-auto flex w-full max-w-[976px] flex-col gap-8">
      <section className="flex flex-col gap-4" aria-labelledby="search-heading">
        <h1 id="search-heading" className="sr-only">
          Search Xplorem
        </h1>
        <label className="relative mx-auto flex h-[70px] w-full max-w-[768px] items-center rounded-full border border-border/50 bg-surface px-6 shadow-[0_12px_36px_rgba(0,0,0,0.18)] focus-within:border-brand">
          <FiSearch
            aria-hidden="true"
            className="mr-4 shrink-0 text-ink-subtle"
            size={20}
          />
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
              <FiX aria-hidden="true" size={18} />
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
              onClick={() => changeMediaType(filter.value)}
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
              <FiChevronDown aria-hidden="true" size={14} />
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
              changeMediaType("person");
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
            {!loading && !error && totalPages > 1 && (
              <span className="font-mono text-xs uppercase text-ink-faint">
                {data?.total_results || 0} total results
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
            <>
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
              <Pagination
                currentPage={currentPage}
                onPageChange={changePage}
                totalPages={totalPages}
              />
            </>
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
                Fresh from the catalogue
              </h2>
              <p className="mt-1 text-sm text-ink-subtle">
                A live pulse of what people are watching this week.
              </p>
            </div>
            <span className="hidden font-mono text-xs uppercase text-ink-faint sm:block">
              Explore
            </span>
          </div>

          {landingLoading ? (
            <LoadingSpinner
              size="lg"
              className="py-16"
              label="Loading recommendations"
            />
          ) : landingError ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p role="alert" className="text-sm text-danger">
                {landingError.message}
              </p>
              <button
                className="rounded-full border border-border/50 bg-surface px-4 py-2 text-sm font-bold text-ink-muted hover:bg-surface-raised hover:text-ink"
                onClick={reloadLanding}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                {(landingData?.recommendations || []).map((item) => (
                  <li key={`${item.media_type}-${item.id}`}>
                    <MediaCard item={item} />
                  </li>
                ))}
              </ul>

              <div
                className="flex flex-col gap-8"
                aria-labelledby="genres-heading"
              >
                <div>
                  <h2
                    id="genres-heading"
                    className="font-sora text-2xl font-semibold text-ink sm:text-3xl"
                  >
                    Pick a lane
                  </h2>
                  <p className="mt-1 text-sm text-ink-subtle">
                    Jump into a mood without knowing what to type.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {(landingData?.genreHighlights || []).map((genre) => {
                    const image = imageUrl(
                      genre.item?.backdrop_path || genre.item?.poster_path,
                      genre.item?.backdrop_path ? "w780" : "w500",
                    );

                    return (
                      <button
                        className="group relative flex h-32 items-end overflow-hidden rounded-xl border border-border/50 bg-surface p-4 text-left transition-transform hover:-translate-y-1 hover:border-brand/50"
                        key={genre.value}
                        onClick={() => chooseGenre(genre)}
                        type="button"
                      >
                        {image && (
                          <img
                            alt=""
                            className="absolute inset-0 size-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            src={image}
                          />
                        )}
                        <span className="absolute inset-0 bg-gradient-to-t from-canvas/90 via-canvas/20 to-transparent" />
                        <span className="relative font-sora text-xl font-semibold text-ink transition-colors group-hover:text-brand">
                          {genre.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

function Pagination({ currentPage, onPageChange, totalPages }) {
  if (totalPages <= 1) return null;

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  return (
    <nav
      aria-label="Search result pages"
      className="flex items-center justify-center gap-4 border-t border-border/30 pt-6"
    >
      <button
        aria-label="Previous page"
        className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-surface text-ink-muted transition-colors hover:border-brand/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!canGoBack}
        onClick={() => onPageChange(currentPage - 1)}
        title="Previous page"
        type="button"
      >
        <FiChevronLeft aria-hidden="true" size={20} />
      </button>
      <span className="font-mono text-xs uppercase text-ink-faint">
        Page {currentPage} of {totalPages}
      </span>
      <button
        aria-label="Next page"
        className="flex size-10 items-center justify-center rounded-full border border-border/50 bg-surface text-ink-muted transition-colors hover:border-brand/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!canGoForward}
        onClick={() => onPageChange(currentPage + 1)}
        title="Next page"
        type="button"
      >
        <FiChevronRight aria-hidden="true" size={20} />
      </button>
    </nav>
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
