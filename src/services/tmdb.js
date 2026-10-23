
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500'

async function fetchTMDB(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error('TMDB token missing. Check your .env file.')
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  url.search = new URLSearchParams(params)

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      response.status === 401 || response.status === 403
        ? 'TMDB authentication failed. Check your credentials.'
        : `TMDB request failed (${response.status}).`,
    )
  }

  return response.json()
}

async function fetchMovies(endpoint, params = {}) {
  const data = await fetchTMDB(endpoint, params)
  return data.results ?? []
}

function searchParams(query, searchType) {
  return {
    query: query.trim(),
    include_adult: 'false',
    language: 'en-US',
    page: '1',
    search_type: searchType,
  }
}

export async function searchMovies(query) {
  if (!query.trim()) return []

  return fetchMovies(
    '/search/movie',
    searchParams(query, 'phrase'),
  )
}

export async function searchMovieSuggestions(query) {
  if (!query.trim()) return []

  return fetchMovies(
    '/search/movie',
    searchParams(query, 'ngram'),
  )
}

export function getPopularMovies() {
  return fetchMovies('/movie/popular', {
    language: 'en-US',
    page: '1',
  })
}

export function getNowPlayingMovies() {
  return fetchMovies('/movie/now_playing', {
    language: 'en-US',
    page: '1',
    region: 'IN',
  })
}
