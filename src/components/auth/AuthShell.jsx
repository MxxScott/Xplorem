import { Link } from "react-router-dom";

/**
 * Full-bleed cinematic auth chrome from the Figma Login/Signup frames:
 * background image + ambient glows + optional glass card.
 */
function AuthShell({
  background,
  brand = "inline",
  cardClassName = "",
  footer,
  children,
}) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <img
        src={background}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,10,20,0.35)_0%,rgba(5,10,20,0.82)_70%,rgba(5,10,20,0.95)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 size-112 rounded-full bg-brand/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-1/4 size-88 rounded-full bg-brand-bright/10 blur-3xl"
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6">
        {brand === "above" && (
          <Link
            to="/"
            className="flex items-center gap-2 font-sora text-2xl font-bold tracking-[-0.6px] text-brand"
          >
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-lg bg-brand-bright text-sm text-brand-deep"
            >
              ▶
            </span>
            Xplorem
          </Link>
        )}

        <div
          className={`w-full rounded-2xl border border-border/50 bg-[rgba(14,19,30,0.75)] p-8 shadow-[0_0_60px_rgba(163,201,255,0.08)] backdrop-blur-xl sm:p-10 ${cardClassName}`}
        >
          {brand === "inline" && (
            <Link
              to="/"
              className="mb-6 flex items-center justify-center gap-2 font-sora text-2xl font-bold tracking-[-0.6px] text-brand"
            >
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-md bg-brand-bright/20 text-xs text-brand"
              >
                ▶
              </span>
              Xplorem
            </Link>
          )}
          {children}
        </div>

        {footer}
      </div>
    </div>
  );
}

export default AuthShell;
