import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HeroTrailer from "./HeroTrailer";
import useLayout from "../../hooks/useLayout";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import { imageUrl } from "../../services/tmdbApi";

const ROTATE_MS = 12000;

function Hero({ items = [] }) {
  const slides = items.slice(0, 5);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { setIsOverHero } = useLayout();
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef(null);
  // The first render has no trending data yet, so the component bails to null
  // and there's no node to observe. This has to be a dependency: without it the
  // effect's only dep is the stable setter, so it would run once against a null
  // ref and never again — the observer would never attach and the chrome would
  // stay opaque forever.
  const hasSlides = slides.length > 0;

  // Tell the chrome when the hero is behind it so the header and sidebar can go
  // transparent. Cleanup resets the flag — otherwise navigating away from Home
  // would leave them stuck in their transparent state.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsOverHero(entry.intersectionRatio > 0.5),
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      setIsOverHero(false);
    };
  }, [setIsOverHero, hasSlides]);

  useEffect(() => {
    if (paused || prefersReducedMotion || slides.length < 2) return;

    const timer = setInterval(
      () => setIndex((current) => (current + 1) % slides.length),
      ROTATE_MS,
    );

    return () => clearInterval(timer);
  }, [paused, prefersReducedMotion, slides.length]);

  if (slides.length === 0) return null;

  const active = slides[index];
  const mediaType = active.media_type || (active.title ? "movie" : "tv");
  const title = active.title || active.name;
  const date = active.release_date || active.first_air_date;
  const year = date ? date.slice(0, 4) : null;
  const rating = active.vote_average ? active.vote_average.toFixed(1) : null;
  const backdrop = imageUrl(active.backdrop_path, "w1280");

  return (
    <section
      ref={ref}
      aria-label="Featured titles"
      // Cancels <main>'s padding so the hero spans the viewport while the rest
      // of the page stays in its gutters. Values mirror RootLayout: px-6
      // everywhere, lg:pl-24 to clear the sidebar rail. Deliberately not
      // 100vw — that includes the scrollbar and overflows on Windows.
      // -mt-24 is main's 2rem top padding plus the navbar's 4rem, which slides
      // the hero up underneath the sticky header — that's what gives the
      // transparent header something to be transparent over. Full 100svh then
      // fills the viewport exactly; svh so mobile chrome hiding doesn't jump it.
      className="relative -mx-6 -mt-24 h-[100svh] min-h-[520px] w-[calc(100%+3rem)] overflow-hidden lg:-ml-24 lg:w-[calc(100%+7.5rem)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {backdrop && (
        <img
          src={backdrop}
          alt=""
          className="absolute inset-0 size-full object-cover object-top"
        />
      )}

      {/* The trailer layers over the still, so a missing video or a blocked
          embed just leaves the backdrop showing. */}
      {!prefersReducedMotion && (
        <HeroTrailer
          mediaType={mediaType}
          mediaId={active.id}
          active
          title={title}
        />
      )}

      {/* Three scrims: upward for the title block, sideways so the collapsed
          sidebar rail stays legible against bright frames, and a short one
          downward from the top — the header sits transparent over the video
          here, so its links need something behind them. */}
      <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/90 via-transparent to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-canvas/85 to-transparent" />

      <div className="relative flex size-full flex-col justify-end gap-4 px-6 pb-12 lg:pl-28 lg:pr-12">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-wider text-brand">
            Featured now
          </p>
          <h1 className="font-sora text-4xl font-bold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase text-ink-muted">
            {rating && <span className="text-star">★ {rating}</span>}
            {year && <span>{year}</span>}
            <span>{mediaType}</span>
          </div>
          {active.overview && (
            <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-ink-muted">
              {active.overview}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link
              to={`/media/${active.id}?type=${mediaType}`}
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-canvas transition-colors hover:bg-brand-bright"
            >
              View details
            </Link>
          </div>
        </div>

        {slides.length > 1 && (
          <div role="tablist" aria-label="Featured title" className="flex gap-2">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={slideIndex === index}
                aria-label={slide.title || slide.name}
                onClick={() => setIndex(slideIndex)}
                className={`h-1.5 rounded-full transition-all ${
                  slideIndex === index
                    ? "w-8 bg-brand"
                    : "w-4 bg-ink-muted/40 hover:bg-ink-muted"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
