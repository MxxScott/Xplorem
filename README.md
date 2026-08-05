# Xplorem

A media explorer for movies and TV shows, built on the [TMDB](https://www.themoviedb.org/) API. Browse trending titles, search the catalogue, keep a personal watchlist, and write private notes and ratings.

Frontend is React + Vite + Tailwind. Auth and persistence are handled by Supabase.

> **Status: early development.** Routing and the app shell are in place. Most pages are stubs, and the hooks, services, and context modules are empty placeholders. See [Roadmap](#roadmap) for what's actually done.

## Tech stack

| Concern | Choice |
| --- | --- |
| UI | React 19 |
| Build tooling | Vite 8 |
| Routing | React Router 7 (`createBrowserRouter`) |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| Auth & database | Supabase (planned) |
| Media data | TMDB API (planned) |
| Linting | ESLint 10 |

## Getting started

Requires Node.js 20.19+ or 22.12+ (Vite 8 baseline).

```bash
npm install
npm run dev
```

The dev server prints a local URL, typically <http://localhost:5173>.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

### Environment variables

Not yet wired up. Once the TMDB and Supabase integrations land, create a `.env.local` in the project root:

```bash
VITE_TMDB_API_KEY=your_tmdb_key
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Only the Supabase *anon* key belongs here — it is safe to expose to the browser, and row-level security is what actually protects user data. Never put a service-role key in a `VITE_`-prefixed variable; Vite inlines those into the client bundle.

`.env.local` is covered by the `*.local` rule in `.gitignore`.

## Project structure

```text
src/
├── assets/
├── components/
│   ├── common/       # Button, Input, LoadingSpinner, ProtectedRoute
│   ├── layout/       # Navbar, Footer
│   └── media/        # MediaCard, MediaGrid, ReviewPanel
├── context/          # AuthContext — Supabase session
├── hooks/            # useDebounce, useFetch, useLocalStorage
├── Layouts/
│   └── RootLayout.jsx
├── pages/            # Home, Search, MediaDetails, Watchlist, Login, Signup, NotFound
├── services/         # supabaseClient, tmdbApi
├── App.jsx           # Route definitions
└── main.jsx
```

### Routes

| Path | Page | Notes |
| --- | --- | --- |
| `/` | Home | Trending feed |
| `/search` | Search | Debounced TMDB search |
| `/media/:id` | MediaDetails | Details plus review panel |
| `/watchlist` | Watchlist | Auth-gated |
| `/login`, `/signup` | Login, Signup | Supabase auth |
| `*` | NotFound | Catch-all |

## Planned features

The design decisions behind these are written up in [`PDR.md`](./PDR.md).

- **Debounced search with in-memory caching** — waits for a pause in typing before hitting TMDB, and serves repeat queries from a local cache instead of refetching.
- **Optimistic watchlist updates** — the UI updates immediately and rolls back if the Supabase write fails.
- **Hybrid state persistence** — guest watchlists live in `localStorage` and sync to the database on sign-up or login, so nothing is lost during onboarding.
- **Review panel** — a slide-over for private notes with live markdown preview and a keyboard-navigable star rating.

## Roadmap

- [x] Vite, Tailwind, and React Router scaffolding
- [x] Route table and root layout
- [ ] TMDB service layer and `useFetch`
- [ ] Trending feed on Home
- [ ] Debounced search
- [ ] Supabase auth and `AuthContext`
- [ ] Watchlist persistence
- [ ] Optimistic updates and review panel

## Known issues

- Both `react-router` (v5) and `react-router-dom` (v7) are listed as dependencies. Only the latter is used; the v5 package is a stray install and should be removed.
- The catch-all route in `App.jsx` is declared without a `path`, so it renders as an index-style match rather than a 404 fallback. It needs `path="*"`.
- `PDR.md` refers to the project as *CineTrack*, an earlier working name.
