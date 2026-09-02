import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCompass, FiSearch } from "react-icons/fi";

function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  // history.length is 1 when this tab opened straight onto the bad URL — there
  // is nothing behind it, so "Go back" would be a dead button.
  const canGoBack = window.history.length > 1;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand">
        <FiCompass aria-hidden="true" size={28} />
      </span>

      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-brand">
          Error 404
        </p>
        <h1 className="font-sora text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          This page is off the map
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-ink-subtle sm:text-base">
          We could not find anything at that address. It may have moved, or the
          link that brought you here might be incomplete.
        </p>
      </div>

      {/* Showing the path that failed turns "something is broken" into a
          checkable fact — most 404s here are a typo or a truncated link. */}
      <p className="max-w-full break-all rounded-lg border border-border/30 bg-surface px-4 py-2 font-mono text-xs text-ink-faint">
        {location.pathname}
        {location.search}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-canvas transition-colors hover:bg-brand-bright"
        >
          Browse trending
        </Link>
        <Link
          to="/search"
          className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface px-5 py-2.5 text-sm font-bold text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
        >
          <FiSearch aria-hidden="true" size={16} />
          Search the catalogue
        </Link>
        {canGoBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-ink-muted transition-colors hover:text-brand"
          >
            <FiArrowLeft aria-hidden="true" size={16} />
            Go back
          </button>
        )}
      </div>
    </div>
  );
}

export default NotFound;
