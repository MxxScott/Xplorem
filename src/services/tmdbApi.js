const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Repeat requests (backspacing through a search, revisiting Home) are served
// from here instead of hitting the network again. See Feature A in PDR.md.
const cache = new Map();

export class TmdbError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

async function request(path, params = {}, { signal } = {}) {
  if (!API_KEY) {
    throw new TmdbError(
      "Missing VITE_TMDB_API_KEY. Add it to .env.local and restart the dev server.",
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  const key = url.toString();
  if (cache.has(key)) return cache.get(key);

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new TmdbError(
      `TMDB request failed (${response.status})`,
      response.status,
    );
  }

  const data = await response.json();
  cache.set(key, data);
  return data;
}

export function imageUrl(path, size = "w500") {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}

export function getTrending(mediaType = "all", window = "week", options) {
  return request(`/trending/${mediaType}/${window}`, {}, options);
}

export function searchMulti(query, page = 1, options) {
  return request("/search/multi", { query, page, include_adult: false }, options);
}

function tagResults(response, mediaType) {
  return {
    ...response,
    results: (response.results || []).map((item) => ({
      ...item,
      media_type: mediaType,
    })),
  };
}

export function searchMovies(query, page = 1, options) {
  return request("/search/movie", { query, page, include_adult: false }, options)
    .then((response) => tagResults(response, "movie"));
}

export function searchTv(query, page = 1, options) {
  return request("/search/tv", { query, page, include_adult: false }, options)
    .then((response) => tagResults(response, "tv"));
}

export function searchPeople(query, page = 1, options) {
  return request("/search/person", { query, page, include_adult: false }, options)
    .then((response) => tagResults(response, "person"));
}

const genreIds = {
  movie: {
    action: 28,
    comedy: 35,
    drama: 18,
    "science fiction": 878,
  },
  tv: {
    action: 10759,
    comedy: 35,
    drama: 18,
    "science fiction": 10765,
  },
};

export async function discoverByGenre(genre, mediaType = "all", page = 1, options) {
  const types = mediaType === "movie" || mediaType === "tv"
    ? [mediaType]
    : ["movie", "tv"];

  const responses = await Promise.all(
    types.map((type) =>
      request(
        `/discover/${type}`,
        {
          include_adult: false,
          page,
          sort_by: "popularity.desc",
          with_genres: genreIds[type][genre],
        },
        options,
      ),
    ),
  );

  const results = responses
    .flatMap((response, index) =>
      (response.results || []).map((item) => ({
        ...item,
        media_type: types[index],
      })),
    )
    .sort((first, second) => (second.popularity || 0) - (first.popularity || 0));

  return {
    page,
    results: results.slice(0, 20),
    total_results: responses.reduce(
      (total, response) => total + (response.total_results || 0),
      0,
    ),
    total_pages: mediaType === "all"
      ? Math.max(...responses.map((response) => response.total_pages || 1))
      : responses[0]?.total_pages || 1,
  };
}

export function getMediaDetails(mediaType, id, options) {
  return request(
    `/${mediaType}/${id}`,
    { append_to_response: "credits,videos,similar" },
    options,
  );
}

// Split out from getMediaDetails so the hero can pull just a trailer key
// without dragging credits and similar titles along with it.
export function getVideos(mediaType, id, options) {
  return request(`/${mediaType}/${id}/videos`, {}, options);
}

export function getPopular(mediaType = "movie", page = 1, options) {
  return request(`/${mediaType}/popular`, { page }, options);
}

export function clearCache() {
  cache.clear();
}
