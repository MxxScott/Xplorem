import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
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
            // Opaque surface would read as a solid pill stuck on top of the
            // video once the bar goes transparent, so over the hero it borrows
            // the same frosted treatment as the sidebar pucks.
            className={`h-9 w-64 rounded-full border pl-10 pr-4 text-sm text-ink placeholder:text-ink-subtle transition-colors focus:border-brand focus:outline-none ${
              isOverHero
                ? "border-ink-muted/20 bg-ink/10 backdrop-blur-md"
                : "border-border/50 bg-surface"
            }`}
          />
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
            <FiSearch aria-hidden="true" className="text-ink-muted" size={14} />
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
