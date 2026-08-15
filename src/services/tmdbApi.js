const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const PAGE_SIZE = 20;

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

async function discoverGenrePage(type, genre, page, options) {
  return request(
    `/discover/${type}`,
    {
      include_adult: false,
      page,
      sort_by: "popularity.desc",
      with_genres: genreIds[type][genre],
    },
    options,
  );
}

function availableResultCount(response) {
  const totalResults = response.total_results || 0;
  const totalPages = response.total_pages || 0;
  return Math.min(totalResults, totalPages * PAGE_SIZE);
}

function combinedResultPosition(index, movieCount, tvCount) {
  const pairedCount = Math.min(movieCount, tvCount);
  const interleavedCount = pairedCount * 2;

  if (index < interleavedCount) {
    return {
      type: index % 2 === 0 ? "movie" : "tv",
      sourceIndex: Math.floor(index / 2),
    };
  }

  return {
    type: movieCount > tvCount ? "movie" : "tv",
    sourceIndex: pairedCount + index - interleavedCount,
  };
}

export async function discoverByGenre(genre, mediaType = "all", page = 1, options) {
  const requestedPage = Math.max(1, Math.floor(page));

  if (mediaType === "movie" || mediaType === "tv") {
    return discoverGenrePage(mediaType, genre, requestedPage, options)
      .then((response) => tagResults(response, mediaType));
  }

  const types = ["movie", "tv"];
  const firstResponses = await Promise.all(
    types.map((type) => discoverGenrePage(type, genre, 1, options)),
  );
  const resultCounts = Object.fromEntries(
    types.map((type, index) => [type, availableResultCount(firstResponses[index])]),
  );
  const totalResults = resultCounts.movie + resultCounts.tv;
  const startIndex = (requestedPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalResults);
  const positions = Array.from(
    { length: Math.max(0, endIndex - startIndex) },
    (_, index) => combinedResultPosition(
      startIndex + index,
      resultCounts.movie,
      resultCounts.tv,
    ),
  );
  const pages = Object.fromEntries(
    types.map((type, index) => [type, new Map([[1, firstResponses[index]]])]),
  );
  const missingPages = new Map();

  for (const position of positions) {
    const sourcePage = Math.floor(position.sourceIndex / PAGE_SIZE) + 1;
    const key = `${position.type}-${sourcePage}`;
    if (sourcePage > 1 && !missingPages.has(key)) {
      missingPages.set(
        key,
        discoverGenrePage(position.type, genre, sourcePage, options)
          .then((response) => pages[position.type].set(sourcePage, response)),
      );
    }
  }

  await Promise.all(missingPages.values());

  const results = positions.flatMap(({ sourceIndex, type }) => {
    const sourcePage = Math.floor(sourceIndex / PAGE_SIZE) + 1;
    const item = pages[type].get(sourcePage)?.results?.[sourceIndex % PAGE_SIZE];
    return item ? [{ ...item, media_type: type }] : [];
  });

  return {
    page: requestedPage,
    results,
    total_results: totalResults,
    total_pages: Math.max(1, Math.ceil(totalResults / PAGE_SIZE)),
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
