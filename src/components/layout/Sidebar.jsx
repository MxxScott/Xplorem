import { NavLink } from "react-router-dom";
import { FiBookmark, FiSearch, FiTrendingUp } from "react-icons/fi";
import useLayout from "../../hooks/useLayout";

const sections = [
  {
    title: "Discover",
    items: [
      {
        to: "/",
        label: "Trending",
        end: true,
        icon: FiTrendingUp,
      },
      {
        to: "/search",
        label: "Search",
        icon: FiSearch,
      },
    ],
  },
  {
    title: "Your library",
    items: [
      {
        to: "/watchlist",
        label: "Watchlist",
        icon: FiBookmark,
      },
    ],
  },
];

function Sidebar() {
  const { isOverHero } = useLayout();

  return (
    // Fixed rather than in flow, so the hero and navbar can span the full
    // viewport. group/rail drives the expand — hover or keyboard focus anywhere
    // inside widens it, so it's reachable without a pointer.
    <aside
      className={`group/rail fixed left-0 top-16 bottom-0 z-40 hidden w-16 overflow-hidden border-r transition-[width,background-color,border-color] duration-300 hover:w-64 focus-within:w-64 lg:block ${
        isOverHero
          ? "border-transparent bg-transparent hover:bg-surface/95 focus-within:bg-surface/95 hover:backdrop-blur-xl focus-within:backdrop-blur-xl"
          : "border-border/30 bg-surface/95 backdrop-blur-xl"
      }`}
    >
      <nav className="flex h-full flex-col gap-6 py-6">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            {/* Headings would clip in the 64px rail, so they fade in with it
                and are hidden from assistive tech until then. */}
            <h2
              aria-hidden="true"
              className="truncate px-6 font-mono text-xs uppercase tracking-wider text-ink-faint opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100"
            >
              {section.title}
            </h2>
            <ul className="flex flex-col gap-1 px-3">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-full py-1.5 pl-0 pr-3 text-sm font-medium transition-colors ${
                        isActive ? "text-brand" : "text-ink-muted hover:text-ink"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* The round translucent puck stays put as the rail
                            widens; only the label slides in beside it. */}
                        <span
                          className={`flex size-10 shrink-0 items-center justify-center rounded-full border backdrop-blur-sm transition-colors ${
                            isActive
                              ? "border-brand/40 bg-brand/20 text-brand"
                              : "border-ink-muted/20 bg-ink/10 text-ink-muted"
                          }`}
                        >
                          <item.icon aria-hidden="true" size={18} strokeWidth={1.8} />
                        </span>
                        <span className="truncate opacity-0 transition-opacity duration-200 group-hover/rail:opacity-100 group-focus-within/rail:opacity-100">
                          {item.label}
                        </span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
