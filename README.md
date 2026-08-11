# Xplorem

A media explorer for movies and TV shows, built on the [TMDB](https://www.themoviedb.org/) API. Browse trending titles, search the catalogue, keep a personal watchlist, and write private notes and ratings — all client-side.

Frontend is React + Vite + Tailwind. There is **no backend**: accounts, watchlists, notes, and ratings live in `localStorage` on your machine, so everything survives a refresh without a server. The only external service is the TMDB API.

> **Status: core shell working.** Routing, layout, design tokens, common components, the TMDB service layer, custom hooks, and the Home trending feed are in place. Search, auth, watchlist, and media details are next — see [Roadmap](#roadmap).

## Focus

This project is a **React showcase** — state management (Context, custom hooks, local state), async data fetching, performance (debouncing, response caching), and UX (optimistic updates, keyboard-accessible components). Keeping the backend out of the picture means the React decisions carry the app.

## Tech stack

| Concern | Choice |
| --- | --- |
| UI | React 19 |
| Build tooling | Vite 8 |
| Routing | React Router 7 (`createBrowserRouter`) |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) |
| Media data | TMDB API |
| State & persistence | React Context + custom hooks + `localStorage` |
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

The only secret is the TMDB key. Copy `.env.example` to `.env.local` and fill it in:

```bash
VITE_TMDB_API_KEY=your_tmdb_key
```

Get a key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) — use the *API Key (v3 auth)* value, not the read access token.

`.env.local` is covered by the `*.local` rule in `.gitignore`, so the key never gets committed. Vite inlines `VITE_`-prefixed variables into the client bundle at startup — restart the dev server after changing it.

## Project structure

```text
src/
├── assets/
├── components/
│   ├── common/       # Button, Input, LoadingSpinner, ProtectedRoute
│   ├── layout/       # Navbar, Sidebar, Footer
│   └── media/        # MediaCard, MediaGrid, ReviewPanel
├── context/          # AuthContext — localStorage session
├── hooks/            # useDebounce, useFetch, useLocalStorage
├── Layouts/
│   └── RootLayout.jsx
├── pages/            # Home, Search, MediaDetails, Watchlist, Login, Signup, NotFound
├── services/         # tmdbApi
├── App.jsx           # Route definitions
└── main.jsx
```

### Routes

| Path | Page | Notes |
| --- | --- | --- |
| `/` | Home | Trending feed |
| `/search` | Search | Debounced TMDB search |
| `/media/:id` | MediaDetails | Details plus review panel |
| `/watchlist` | Watchlist | Requires a local account |
| `/login`, `/signup` | Login, Signup | `localStorage` auth |
| `*` | NotFound | Catch-all |

## Planned features

The design decisions behind these are written up in [`PDR.md`](./PDR.md) (its working name there is *CineTrack*).

- **Debounced search with in-memory caching** — waits for a pause in typing before hitting TMDB, and serves repeat queries from a local cache instead of refetching.
- **Client-side auth** — accounts are stored in `localStorage` (no server); a mock session in Context guards the watchlist route.
- **Optimistic watchlist updates** — the UI updates immediately; if the storage write fails, the change rolls back with an error toast.
- **Everything persists locally** — watchlist, notes, and ratings are saved through a custom `useLocalStorage` hook that stays in sync across tabs.
- **Review panel** — a slide-over for private notes with live markdown preview and a keyboard-navigable star rating.

## Roadmap

- [x] Vite, Tailwind, and React Router scaffolding
- [x] Route table and root layout
- [x] Design tokens extracted from the Figma file
- [x] Common components (Button, Input, LoadingSpinner)
- [x] TMDB service layer with response caching
- [x] Custom hooks: `useFetch`, `useDebounce`, `useLocalStorage`
- [x] Home trending feed (Today / This week)
- [ ] Debounced search page
- [ ] Client-side auth (login/signup, `AuthContext`, `ProtectedRoute`)
- [ ] Watchlist page with `localStorage` persistence
- [ ] Media details page
- [ ] Review panel with markdown preview and star rating
- [ ] Optimistic watchlist updates
