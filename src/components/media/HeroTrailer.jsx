import { useEffect, useState } from "react";
import { getVideos } from "../../services/tmdbApi";

// TMDB doesn't host video — /videos returns YouTube keys, so the "trailer" is a
// YouTube embed. Prefer an official Trailer, then any Trailer, then a Teaser.
function pickTrailer(videos = []) {
  const youtube = videos.filter((video) => video.site === "YouTube");

  return (
    youtube.find((video) => video.type === "Trailer" && video.official) ||
    youtube.find((video) => video.type === "Trailer") ||
    youtube.find((video) => video.type === "Teaser") ||
    null
  );
}

// Autoplay only survives muted — browsers block audible autoplay outright.
// The rest strips YouTube's chrome so this reads as background video rather
// than an embedded player: no control bar, annotations, keyboard handling,
// fullscreen button, or end-screen suggestions. loop needs `playlist` set to
// the same key — a single-video loop is really a one-item playlist.
function embedUrl(key) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: key,
    playsinline: "1",
    modestbranding: "1",
    rel: "0",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
  });

  return `https://www.youtube-nocookie.com/embed/${key}?${params}`;
}

function HeroTrailer({ mediaType, mediaId, active, title }) {
  // Keyed by id so switching slides drops the previous trailer without an
  // effect to reset it — otherwise the old video would flash under the new
  // title for a frame while the fetch is in flight.
  const [resolved, setResolved] = useState({ id: null, key: null });
  const trailerKey = resolved.id === mediaId ? resolved.key : null;

  // The iframe remounts per trailer but this state doesn't, so key it the same
  // way instead of resetting it from an effect.
  const [loadedKey, setLoadedKey] = useState(null);
  const loaded = trailerKey !== null && loadedKey === trailerKey;

  useEffect(() => {
    // Only the visible slide fetches, so paging through the hero doesn't kick
    // off a request per title.
    if (!active || !mediaType || !mediaId) return;

    const controller = new AbortController();
    let stale = false;

    async function load() {
      try {
        const data = await getVideos(mediaType, mediaId, {
          signal: controller.signal,
        });
        if (!stale) {
          setResolved({ id: mediaId, key: pickTrailer(data.results)?.key ?? null });
        }
      } catch {
        // No trailer is a normal outcome, not an error worth surfacing — the
        // backdrop still underneath stays visible.
        if (!stale) setResolved({ id: mediaId, key: null });
      }
    }

    load();

    return () => {
      stale = true;
      controller.abort();
    };
  }, [active, mediaType, mediaId]);

  if (!trailerKey) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Cover math for a 16:9 embed: whichever axis is short gets driven past
          100% so the video always fills the frame instead of letterboxing. The
          extra scale crops the strip of player UI that survives controls=0 —
          the title and share buttons YouTube draws along the top edge.
          Not lazy — the whole point is that it starts on its own.
          The delayed fade covers buffering: onLoad fires when the embed
          document loads, which is earlier than the first painted frame, so
          fading immediately would flash black over the backdrop. */}
      <iframe
        key={trailerKey}
        src={embedUrl(trailerKey)}
        title={`${title} trailer`}
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        onLoad={() => setLoadedKey(trailerKey)}
        className={`absolute left-1/2 top-1/2 h-[max(100%,56.25vw)] w-[max(100%,177.78vh)] scale-[1.18] -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-700 delay-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default HeroTrailer;
