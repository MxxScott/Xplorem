import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiBookmark, FiStar } from "react-icons/fi";
import { imageUrl } from "../../services/tmdbApi";
import useAuth from "../../hooks/useAuth";
import useWatchlist from "../../hooks/useWatchlist";

// TMDB returns `title` for movies and `name` for TV; same for the date fields.
function MediaCard({ item }) {
  const mediaType = item.media_type || (item.title ? "movie" : "tv");
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const year = date ? date.slice(0, 4) : null;
  const poster = imageUrl(item.poster_path, "w342");
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isSaved, toggle } = useWatchlist();
  const saved = isSaved(item);

  function handleWatchlist(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: `${location.pathname}${location.search}` },
      });
      return;
    }

    toggle(item);
  }

  return (
    <article className="group flex flex-col gap-2">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border/30 bg-surface">
        <Link
          to={`/media/${item.id}?type=${mediaType}`}
          aria-label={`View details for ${title}`}
          className="block size-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
        >
          {poster ? (
            <img
              src={poster}
              alt={`${title} poster`}
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center p-4 text-center font-mono text-xs text-ink-subtle">
              No poster
            </div>
          )}
        </Link>
        <button
          type="button"
          aria-pressed={saved}
          aria-label={
            saved
              ? `Remove ${title} from your library`
              : `Save ${title} to your library`
          }
          title={saved ? "Remove from library" : "Save to library"}
          onClick={handleWatchlist}
          className={`absolute left-2 top-2 flex size-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
            saved
              ? "border-brand/50 bg-brand text-canvas"
              : "border-ink-muted/20 bg-canvas/75 text-ink-muted hover:border-brand/50 hover:text-brand"
          }`}
        >
          <FiBookmark
            aria-hidden="true"
            fill={saved ? "currentColor" : "none"}
            size={17}
          />
        </button>
        {rating && (
          <span className="pointer-events-none absolute right-2 top-2 flex items-center gap-1 rounded-full bg-canvas/80 px-2 py-1 font-mono text-xs text-star backdrop-blur-sm">
            <FiStar aria-hidden="true" size={12} /> {rating}
          </span>
        )}
      </div>
      <Link
        to={`/media/${item.id}?type=${mediaType}`}
        className="flex flex-col gap-0.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      >
        <h3 className="line-clamp-2 font-sora text-sm font-bold leading-tight text-ink transition-colors group-hover:text-brand">
          {title}
        </h3>
        <p className="font-mono text-xs uppercase text-ink-faint">
          {[year, mediaType].filter(Boolean).join(" · ")}
        </p>
      </Link>
    </article>
  );
}

export default MediaCard;
