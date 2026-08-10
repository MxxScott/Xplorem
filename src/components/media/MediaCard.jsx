import { Link } from "react-router-dom";
import { imageUrl } from "../../services/tmdbApi";

// TMDB returns `title` for movies and `name` for TV; same for the date fields.
function MediaCard({ item }) {
  const mediaType = item.media_type || (item.title ? "movie" : "tv");
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const year = date ? date.slice(0, 4) : null;
  const poster = imageUrl(item.poster_path, "w342");
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  return (
    <Link
      to={`/media/${item.id}?type=${mediaType}`}
      className="group flex flex-col gap-2 rounded-xl focus-visible:outline-none"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border/30 bg-surface">
        {poster ? (
          <img
            src={poster}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center p-4 text-center font-mono text-xs text-ink-subtle">
            No poster
          </div>
        )}
        {rating && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-canvas/80 px-2 py-1 font-mono text-xs text-star backdrop-blur-sm">
            ★ {rating}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="line-clamp-2 font-sora text-sm font-bold leading-tight text-ink transition-colors group-hover:text-brand">
          {title}
        </h3>
        <p className="font-mono text-xs uppercase text-ink-faint">
          {[year, mediaType].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

export default MediaCard;
