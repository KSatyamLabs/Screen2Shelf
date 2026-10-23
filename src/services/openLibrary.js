
const API_URL = 'https://openlibrary.org/search.json'
const FIELDS = 'key,title,author_name,first_publish_year,cover_i,subject'

const GENRES = {
  28: 'action',
  12: 'adventure',
  16: 'animation',
  35: 'comedy',
  80: 'crime',
  99: 'documentary',
  18: 'drama',
  10751: 'family',
  14: 'fantasy',
  36: 'history',
  27: 'horror',
  10402: 'music',
  9648: 'mystery',
  10749: 'romance',
  878: 'science fiction',
  53: 'thriller',
  10752: 'war',
  37: 'western',
}

const STOP_WORDS = new Set(
  `about after again also another any are because been before being
  between both but can could did does doing down each few for from had
  has have having her here him his how into its just more most movie
  movies much not now off once only other our out over same she some
  such than that the their them then there these they this those through
  too under until very was were what when where which while who will
  with would you your`.split(/\s+/),
)

const normalize = (text = '') =>
  text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').trim().replace(/\s+/g, ' ')

function keywords(text = '') {
  return [
    ...new Set(
      normalize(text)
        .split(/[\s-]+/)
        .filter((word) => word.length > 2 && !STOP_WORDS.has(word)),
    ),
  ]
}

async function searchBooks(params) {
  const url = new URL(API_URL)
  url.search = new URLSearchParams({
    ...params,
    limit: '30',
    fields: FIELDS,
  })

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Open Library request failed (${response.status}).`)
  }

  return (await response.json()).docs ?? []
}

function rankBook(book, movie, terms, genres) {
  const title = normalize(book.title)
  const movieTitle = normalize(movie.title)
  const titleWords = new Set(keywords(book.title))
  const subjects = new Set(keywords((book.subject ?? []).join(' ')))
  let score = 0

  if (title === movieTitle) score += 12
  else if (title.includes(movieTitle)) score += 8
  else if (movieTitle.includes(title) && title.length > 3) score += 5

  for (const term of terms) {
    if (titleWords.has(term)) score += 3
    if (subjects.has(term)) score += 2
  }

  for (const genre of genres) {
    if (subjects.has(genre)) score += 2
    if (titleWords.has(genre)) score += 1
  }

  if (book.cover_i) score += 0.5
  if (book.author_name?.length) score += 0.5

  return score
}

export async function getBooksForMovie(movie, { broad = false } = {}) {
  const genres = [
    ...new Set(
      (movie.genre_ids ?? []).map((id) => GENRES[id]).filter(Boolean),
    ),
  ]

  const terms = keywords(movie.overview).slice(0, 8)
  const searches = []

  if (movie.title?.trim()) {
    searches.push(() => searchBooks({ title: movie.title.trim() }))
  }

  // Search story keywords together first.
  if (terms.length) {
    searches.push(() => searchBooks({ q: terms.slice(0, 5).join(' ') }))
  }

  // Broaden the search using individual subjects and story terms.
  if (broad) {
    for (const genre of genres) {
      searches.push(() => searchBooks({ subject: genre }))
    }

    for (const term of terms.slice(0, 4)) {
      searches.push(() => searchBooks({ q: term }))
    }
  }

  const collected = new Map()
  let successfulSearches = 0

  // Run a few searches concurrently to avoid overwhelming the API.
  for (let i = 0; i < searches.length; i += 3) {
    const batch = await Promise.allSettled(
      searches.slice(i, i + 3).map((search) => search()),
    )

    for (const result of batch) {
      if (result.status !== 'fulfilled') continue
      successfulSearches++

      for (const book of result.value) {
        if (book.key && !collected.has(book.key)) {
          collected.set(book.key, book)
        }
      }
    }

    if (!broad && collected.size >= 6) break
  }

  if (!successfulSearches && searches.length) {
    throw new Error('Could not reach Open Library. Please try again.')
  }

  const ranked = [...collected.values()]
    .map((book) => ({
      book,
      score: rankBook(book, movie, terms, genres),
    }))
    .sort((a, b) => b.score - a.score)

  const relevant = ranked.filter(({ score }) => score > 0)

  return (relevant.length ? relevant : ranked)
    .slice(0, 24)
    .map(({ book }) => book)
}
