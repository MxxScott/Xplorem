function Footer() {
  return (
    <footer className="mt-auto border-t border-border/30 px-6 py-8">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-sora font-bold text-ink-muted">Xplorem</span> — a
          media explorer.
        </p>
        <p>
          Data from{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-brand"
          >
            TMDB
          </a>
          . Not endorsed by TMDB.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
