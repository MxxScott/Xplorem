# Project Design Record (PDR): Xplorem (Media Explorer)

## 1. Project Overview

**Xplorem** is a web application that allows users to explore movies and TV shows using the TMDB API, maintain a personalized watchlist, and write private notes and ratings. The frontend is built with React and Tailwind CSS, while authentication and database management are handled by Supabase.

### Core Objectives

* Demonstrate robust React state management (Context API, custom hooks, and local state).
* Implement secure authentication and row-level database security.
* Showcase optimized asynchronous data fetching and performance practices.

---

## 2. Technical Stack

* **Frontend Library:** React (Vite)
* **Routing:** React Router v6
* **Styling:** Tailwind CSS
* **Backend-as-a-Service (BaaS):** Supabase (Auth & PostgreSQL)
* **External API:** TMDB (The Movie Database) API

---

## 3. Recommended Core & Impressive Features

To make this project stand out on a portfolio, it includes features that address common real-world engineering challenges in React, such as performance, asynchronous state, and user experience (UX).

### Feature A: Debounced Search with Result Caching (Performance)

* **Description:** A search input that queries the TMDB API as the user types, but optimizes network usage.
* **The "Impressive" Element:**
  * **Debouncing:** Prevents API calls on every keystroke (waits 500ms after the user stops typing).
  * **In-Memory Caching:** Stores previous search queries and results in a React `useRef` or state cache. If the user backspaces from "batman" to "bat", the app retrieves the "bat" results from cache instantly instead of making a duplicate API request.

### Feature B: Optimistic UI Updates for Watchlist Actions (UX)

* **Description:** Adding or removing items from the watchlist happens instantaneously on the screen.
* **The "Impressive" Element:** Instead of showing a loading spinner while waiting for Supabase to confirm the database write, the React state updates immediately. The network request runs in the background. If the database update fails, React automatically rolls back the UI to its previous state and displays an error toast notification.

### Feature C: Hybrid State Persistence (State Management)

* **Description:** Seamless handling of user data depending on their login status.
* **The "Impressive" Element:** If a guest user adds items to their watchlist, they are saved to `localStorage`. When the user registers or logs in, a utility function syncs their guest `localStorage` watchlist to the Supabase database and clears the local cache, preventing data loss during onboarding.

### Feature D: Interactive Review Panel with Markdown Support (Forms & Refs)

* **Description:** A slide-over panel on the Media Details page where users can write private reviews, format them, and assign a 5-star rating.
* **The "Impressive" Element:** Features a live markdown preview tab (handling simple bold, italic, and lists) and a fully accessible, keyboard-navigable star rating component built from scratch using React event handlers.

---

## 4. Database Schema (Supabase)

To support these features, the database requires two primary tables. Row-Level Security (RLS) is enabled so users can only access their own data.

### Table: `profiles`

Created automatically via a trigger when a user signs up through Supabase Auth.

```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text
);
```

### Table: `watchlist`

Stores user-specific movie/TV show data.

```sql
create table watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  media_id integer not null, -- TMDB ID
  media_type text check (media_type in ('movie', 'tv')) not null,
  title text not null,
  poster_path text,
  rating integer check (rating >= 1 and rating <= 5),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensures a user cannot add the same media item twice
  unique(user_id, media_id, media_type)
);
```

---

## 5. Proposed Component Hierarchy

A clean directory structure is essential for demonstrating maintainable React architecture.

```text
src/
├── assets/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx      # Route guard for auth
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── media/
│       ├── MediaCard.jsx           # Reusable card component
│       ├── MediaGrid.jsx           # Dynamic grid layout
│       └── ReviewPanel.jsx         # Custom review/rating drawer
├── context/
│   └── AuthContext.jsx             # Manages Supabase session
├── hooks/
│   ├── useDebounce.js              # Limits API calls
│   ├── useFetch.js                 # Generic async fetch handler
│   └── useLocalStorage.js          # Synchronizes state with storage
├── pages/
│   ├── Home.jsx                    # Trending feed
│   ├── Search.jsx                  # Filtered search page
│   ├── MediaDetails.jsx            # Detailed view with reviews
│   ├── Watchlist.jsx               # User's personal list
│   ├── Login.jsx
│   └── Signup.jsx
├── services/
│   ├── supabaseClient.js           # Supabase config
│   └── tmdbApi.js                  # TMDB API config & endpoints
├── App.jsx
└── main.jsx
```

---

## 6. Development Phases

1. **Phase 1 (Basic Routing & Fetching):** Set up Vite, Tailwind, React Router, and the custom `useFetch` hook to display trending media from TMDB.
2. **Phase 2 (Debounced Search):** Build the search page and implement the `useDebounce` hook.
3. **Phase 3 (Auth Integration):** Configure Supabase, build the `AuthContext`, and secure the `Watchlist` route.
4. **Phase 4 (Database Integration & Watchlist):** Connect the database to allow users to add/remove items and read them on the Watchlist page.
5. **Phase 5 (Optimistic UI & Review Panel):** Add the sliding review panel, integrate the markdown preview, and implement the optimistic update logic.
