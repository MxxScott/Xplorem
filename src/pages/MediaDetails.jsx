import { useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBookmark,
  FiCalendar,
  FiClock,
  FiStar,
} from "react-icons/fi";
import MediaCard from "../components/media/MediaCard";
import PageLoader from "../components/common/PageLoader";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import useWatchlist from "../hooks/useWatchlist";
import { getMediaDetails, imageUrl } from "../services/tmdbApi";

// Only these two are real TMDB detail endpoints; anything else in ?type= would
// 404 the request, so it falls back to movie.
const mediaTypes = ["movie", "tv"];

// TMDB gives runtime as a number of minutes on movies, and an array of
// per-episode runtimes on TV.
function formatRuntime(details) {
  const minutes = details.runtime || details.episode_run_time?.[0];
  if (!minutes) return null;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (!hours) return `${remainder}m`;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function formatDate(value) {
  if (!value) return null;

  // TMDB dates are plain YYYY-MM-DD. Passing that to `new Date` parses it as
  // UTC midnight, which renders as the previous day for anyone behind UTC — so
  // build the date from its parts instead.
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function MediaDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const requestedType = searchParams.get("type");
  const mediaType = mediaTypes.includes(requestedType)
    ? requestedType
    : "movie";
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle } = useWatchlist();

  const fetcher = useCallback(
    (options) => getMediaDetails(mediaType, id, options),
    [mediaType, id],
  );

  const { data, loading, error, reload } = useFetch(fetcher, [mediaType, id]);

  if (loading) return <PageLoader label="Loading title" />;

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-5 py-20 text-center">
        <h1 className="font-sora text-3xl font-semibold text-ink">
          We could not load this title
        </h1>
        <p role="alert" className="max-w-md text-sm leading-relaxed text-danger">
          {error.message}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reload}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-canvas transition-colors hover:bg-brand-bright"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-full border border-border/50 bg-surface px-5 py-2.5 text-sm font-bold text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            Back to browse
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const title = data.title || data.name;
  const releaseDate = data.release_date || data.first_air_date;
  const year = releaseDate ? releaseDate.slice(0, 4) : null;
  const rating = data.vote_average ? data.vote_average.toFixed(1) : null;
  const runtime = formatRuntime(data);
  const backdrop = imageUrl(data.backdrop_path, "w1280");
  const poster = imageUrl(data.poster_path, "w500");
  const genres = data.genres || [];
  const cast = (data.credits?.cast || []).slice(0, 8);
  const similar = (data.similar?.results || [])
    .filter((item) => item.poster_path)
    .slice(0, 10)
    // /movie/{id}/similar returns bare results, so tag them for MediaCard's
    // links and the watchlist key.
    .map((item) => ({ ...item, media_type: mediaType }));

  // The watchlist stores TMDB-shaped items, so hand it the same fields a card
  // would — not the full detail payload with credits and similar titles.
  const watchlistItem = {
    id: data.id,
    media_type: mediaType,
    title: data.title,
    name: data.name,
    poster_path: data.poster_path,
    release_date: data.release_date,
    first_air_date: data.first_air_date,
    vote_average: data.vote_average,
  };
  const saved = isSaved(watchlistItem);

  return (
    <div className="flex flex-col gap-10">
      {/* Mirrors Hero's bleed so the backdrop spans the viewport while the rest
          of the page stays in <main>'s gutters. */}
      <section className="relative -mx-6 -mt-8 overflow-hidden lg:-ml-24 lg:-mr-6">
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 size-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/85 to-canvas/40" />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-12 lg:pl-24">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink-muted transition-colors hover:text-brand"
          >
            <FiArrowLeft aria-hidden="true" size={14} />
            Back to browse
          </Link>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-end">
            {poster && (
              <img
                src={poster}
                alt={`${title} poster`}
                className="w-40 shrink-0 rounded-xl border border-border/30 shadow-2xl sm:w-56"
              />
            )}

            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-mono text-xs uppercase tracking-wider text-brand">
                  {mediaType === "tv" ? "TV series" : "Film"}
                </p>
                <h1 className="font-sora text-4xl font-bold leading-tight text-ink sm:text-5xl">
                  {title}
                </h1>
                {data.tagline && (
                  <p className="text-sm italic text-ink-muted">
                    {data.tagline}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase text-ink-muted">
                {rating && (
                  <span className="flex items-center gap-1.5 text-star">
                    <FiStar aria-hidden="true" size={14} />
                    {rating}
                    {data.vote_count > 0 && (
                      <span className="text-ink-faint">
                        ({data.vote_count.toLocaleString()})
                      </span>
                    )}
                  </span>
                )}
                {year && (
                  <span className="flex items-center gap-1.5">
                    <FiCalendar aria-hidden="true" size={14} />
                    {year}
                  </span>
                )}
                {runtime && (
                  <span className="flex items-center gap-1.5">
                    <FiClock aria-hidden="true" size={14} />
                    {runtime}
                  </span>
                )}
                {mediaType === "tv" && data.number_of_seasons > 0 && (
                  <span>
                    {data.number_of_seasons}{" "}
                    {data.number_of_seasons === 1 ? "season" : "seasons"}
                  </span>
                )}
              </div>

              {genres.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <li
                      key={genre.id}
                      className="rounded-full border border-border/50 bg-surface/80 px-3 py-1 text-xs text-ink-muted backdrop-blur-sm"
                    >
                      {genre.name}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {/* Guests can browse but not save — same rule as MediaCard, so
                    the button becomes a sign-in prompt rather than silently
                    doing nothing. */}
                {isAuthenticated ? (
                  <button
                    type="button"
                    aria-pressed={saved}
                    onClick={() => toggle(watchlistItem)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                      saved
                        ? "bg-brand text-canvas hover:bg-brand-bright"
                        : "border border-border/50 bg-surface text-ink-muted hover:bg-surface-raised hover:text-ink"
                    }`}
                  >
                    <FiBookmark
                      aria-hidden="true"
                      fill={saved ? "currentColor" : "none"}
                      size={16}
                    />
                    {saved ? "In your library" : "Save to library"}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    state={{ from: `/media/${id}?type=${mediaType}` }}
                    className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface px-5 py-2.5 text-sm font-bold text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
                  >
                    <FiBookmark aria-hidden="true" size={16} />
                    Sign in to save
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
        {data.overview && (
          <section className="flex max-w-3xl flex-col gap-3">
            <h2 className="font-sora text-2xl font-semibold text-ink">
              Overview
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
              {data.overview}
            </p>
            {releaseDate && (
              <p className="font-mono text-xs uppercase text-ink-faint">
                {mediaType === "tv" ? "First aired" : "Released"}{" "}
                {formatDate(releaseDate)}
              </p>
            )}
          </section>
        )}

        {cast.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="font-sora text-2xl font-semibold text-ink">Cast</h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
              {cast.map((person) => {
                const profile = imageUrl(person.profile_path, "w342");

                return (
                  <li key={person.id} className="flex flex-col gap-2">
                    <div className="aspect-[2/3] overflow-hidden rounded-xl border border-border/30 bg-surface">
                      {profile ? (
                        <img
                          src={profile}
                          alt=""
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center p-3 text-center font-mono text-xs text-ink-subtle">
                          No photo
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className="line-clamp-2 font-sora text-sm font-bold leading-tight text-ink">
                        {person.name}
                      </p>
                      {person.character && (
                        <p className="line-clamp-2 text-xs leading-tight text-ink-faint">
                          {person.character}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {similar.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="font-sora text-2xl font-semibold text-ink">
              More like this
            </h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {similar.map((item) => (
                <li key={item.id}>
                  <MediaCard item={item} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

export default MediaDetails;
