import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import NotFound from "../../pages/NotFound";

// A failed dynamic import is reported differently by each browser, and none of
// them use an error type we can check with instanceof — matching the message is
// the only option. Chrome/Edge say "Failed to fetch dynamically imported
// module", Firefox "error loading dynamically imported module", Safari
// "Importing a module script failed".
function isChunkLoadError(error) {
  const message = String(error?.message || error || "");

  return (
    /dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /Loading chunk \S+ failed/i.test(message)
  );
}

// Wired to every route as `errorElement`. Without it, React Router falls back to
// its own developer screen — the "Unexpected Application Error!" page that tells
// you to add this component.
function RouteError() {
  const error = useRouteError();

  // A 404 thrown by a loader should look like the 404 page, not like a crash.
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  const chunkFailure = isChunkLoadError(error);
  const heading = chunkFailure
    ? "That part of the app did not load"
    : "Something went wrong";
  const detail = chunkFailure
    ? "The page's code could not be downloaded. This usually means the app was updated while your tab was open, or the connection dropped mid-request."
    : "An unexpected error stopped this page from rendering. Reloading will usually clear it.";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-full border border-danger/30 bg-danger/10 text-danger">
        <FiAlertTriangle aria-hidden="true" size={28} />
      </span>

      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-danger">
          {isRouteErrorResponse(error) ? `Error ${error.status}` : "Error"}
        </p>
        <h1 className="font-sora text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {heading}
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-ink-subtle sm:text-base">
          {detail}
        </p>
      </div>

      {/* The raw message is useful when it happens on someone else's machine,
          but it is implementation detail — collapsed by default. */}
      {error?.message && (
        <details className="w-full max-w-full text-left">
          <summary className="cursor-pointer font-mono text-xs uppercase text-ink-faint transition-colors hover:text-ink-muted">
            Technical details
          </summary>
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-border/30 bg-surface px-4 py-3 font-mono text-xs text-ink-faint">
            {error.message}
          </pre>
        </details>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* A full reload, not navigate(0) — the whole point is to re-request
            index.html so the browser picks up current chunk URLs. */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-canvas transition-colors hover:bg-brand-bright"
        >
          <FiRefreshCw aria-hidden="true" size={16} />
          Reload the page
        </button>
        {/* href rather than <Link>: if a chunk is stale, a client-side
            navigation would reuse the same broken module graph. */}
        <a
          href="/"
          className="rounded-full border border-border/50 bg-surface px-5 py-2.5 text-sm font-bold text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
        >
          Back to browse
        </a>
      </div>

      <p className="text-xs text-ink-faint">
        Still stuck? Try{" "}
        <Link to="/search" className="font-bold text-brand hover:underline">
          searching for a title
        </Link>
        .
      </p>
    </div>
  );
}

export default RouteError;
