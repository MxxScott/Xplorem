import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useLayout from "../../hooks/useLayout";

const links = [
  { to: "/", label: "Browse", end: true },
  { to: "/watchlist", label: "Library" },
  { to: "/search", label: "Search" },
];

function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { isOverHero } = useLayout();

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    // Transparent while the hero is behind it, matching the Sidebar — the hero's
    // own top gradient is what keeps the links legible there. Both revert to the
    // solid bar as soon as the hero scrolls past, and the transition is what
    // makes that a fade rather than a snap.
    <header
      className={`sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b px-6 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        isOverHero
          ? "border-transparent bg-transparent"
          : "border-border/30 bg-surface/95 backdrop-blur-xl"
      }`}
    >
      <div className="flex items-center gap-8">
        <Link
          to="/"
          className="font-sora text-2xl font-bold leading-6 tracking-[-0.6px] text-brand"
        >
          Xplorem
        </Link>
        <nav className="hidden flex-row gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center pb-1 text-base font-bold leading-6 transition-colors ${
                  isActive
                    ? "border-b-2 border-b-brand text-brand"
                    : "text-ink-muted hover:text-brand"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSubmit} className="relative hidden sm:block">
          <label htmlFor="navbar-search" className="sr-only">
            Search titles
          </label>
          <input
            id="navbar-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles..."
            className="h-9 w-64 rounded-full border border-border/50 bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-ink-subtle focus:border-brand focus:outline-none"
          />
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 11 11"
              fill="none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.68333 10.5L6.00833 6.825C5.71667 7.05833 5.38125 7.24306 5.00208 7.37917C4.62292 7.51528 4.21944 7.58333 3.79167 7.58333C2.73194 7.58333 1.83507 7.21632 1.10104 6.48229C0.367014 5.74826 0 4.85139 0 3.79167C0 2.73194 0.367014 1.83507 1.10104 1.10104C1.83507 0.367014 2.73194 0 3.79167 0C4.85139 0 5.74826 0.367014 6.48229 1.10104C7.21632 1.83507 7.58333 2.73194 7.58333 3.79167C7.58333 4.21944 7.51528 4.62292 7.37917 5.00208C7.24306 5.38125 7.05833 5.71667 6.825 6.00833L10.5 9.68333L9.68333 10.5ZM3.79167 6.41667C4.52083 6.41667 5.14062 6.16146 5.65104 5.65104C6.16146 5.14062 6.41667 4.52083 6.41667 3.79167C6.41667 3.0625 6.16146 2.44271 5.65104 1.93229C5.14062 1.42188 4.52083 1.16667 3.79167 1.16667C3.0625 1.16667 2.44271 1.42188 1.93229 1.93229C1.42188 2.44271 1.16667 3.0625 1.16667 3.79167C1.16667 4.52083 1.42188 5.14062 1.93229 5.65104C2.44271 6.16146 3.0625 6.41667 3.79167 6.41667Z"
                fill="currentColor"
                className="text-ink-muted"
              />
            </svg>
          </span>
        </form>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-muted sm:inline">
              {user.name}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-bold text-ink-muted transition-colors hover:text-brand"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm font-bold text-ink-muted transition-colors hover:text-brand"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
