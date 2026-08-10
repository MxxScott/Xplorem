import { NavLink } from "react-router-dom";

const sections = [
  {
    title: "Discover",
    items: [
      { to: "/", label: "Trending", end: true },
      { to: "/search", label: "Search" },
    ],
  },
  {
    title: "Your library",
    items: [{ to: "/watchlist", label: "Watchlist" }],
  },
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/30 px-4 py-6 lg:block">
      <nav className="flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-2">
            <h2 className="px-3 font-mono text-xs uppercase tracking-wider text-ink-faint">
              {section.title}
            </h2>
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-surface text-brand"
                          : "text-ink-muted hover:bg-surface hover:text-ink"
                      }`
                    }
                  >
                    {item.label}
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
