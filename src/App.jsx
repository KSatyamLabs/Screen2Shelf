
import { useEffect, useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import MovieGrid from './components/MovieGrid'
import BookGrid from './components/BookGrid'
import {
  searchMovies,
  searchMovieSuggestions,
  getPopularMovies,
  getNowPlayingMovies,
} from './services/tmdb'
import { getBooksForMovie } from './services/openLibrary'
import './App.css'

const normalizeTitle = (title = '') =>
  title.toLowerCase().trim().replace(/\s+/g, ' ')

function rankMovies(movies, query) {
  const term = normalizeTitle(query)

  const rank = (movie) => {
    const title = normalizeTitle(movie.title)
    const original = normalizeTitle(movie.original_title)

    if (title === term || original === term) return 0
    if (title.startsWith(term)) return 1
    if (title.includes(term)) return 2
    if (original.startsWith(term)) return 3
    if (original.includes(term)) return 4
    return 5
  }

  return [...movies].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (b.popularity || 0) - (a.popularity || 0),
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [popular, setPopular] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [homeLoading, setHomeLoading] = useState(true)
  const [booksLoading, setBooksLoading] = useState(false)
  const [error, setError] = useState('')
  const [bookError, setBookError] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [broadSearch, setBroadSearch] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([getPopularMovies(), getNowPlayingMovies()])
      .then(([popularMovies, playingMovies]) => {
        if (cancelled) return
        setPopular(popularMovies)
        setNowPlaying(playingMovies)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load movies.')
      })
      .finally(() => {
        if (!cancelled) setHomeLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const term = query.trim()

    if (term.length < 2 || showResults) {
      setSuggestions([])
      return
    }

    let cancelled = false

    const timer = setTimeout(async () => {
      try {
        const [ngram, phrase] = await Promise.all([
          searchMovieSuggestions(term),
          searchMovies(term),
        ])

        if (cancelled) return

        const unique = new Map(
          [...ngram, ...phrase].map((movie) => [movie.id, movie]),
        )

        setSuggestions(rankMovies([...unique.values()], term).slice(0, 5))
      } catch {
        if (!cancelled) setSuggestions([])
      }
    }, 200)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, showResults])

  useEffect(() => {
    if (!selectedMovie) return

    let cancelled = false

    setBooks([])
    setBookError('')
    setBooksLoading(true)
    setBroadSearch(false)

    getBooksForMovie(selectedMovie)
      .then((results) => {
        if (!cancelled) setBooks(results)
      })
      .catch((err) => {
        if (!cancelled) {
          setBookError(err.message || 'Could not load books.')
        }
      })
      .finally(() => {
        if (!cancelled) setBooksLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedMovie])

  async function handleSearch(event) {
    event.preventDefault()

    const term = query.trim()
    if (!term) return

    setLoading(true)
    setError('')
    setSuggestions([])
    setSelectedMovie(null)
    setShowResults(true)
    setMovies([])

    try {
      const results = await searchMovies(term)
      setMovies(rankMovies(results, term))

      if (!results.length) setError('No movies found. Try another title.')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function selectMovie(movie) {
    setQuery(movie.title)
    setMovies([movie])
    setSelectedMovie(movie)
    setSuggestions([])
    setShowResults(true)
    setError('')
  }

  async function exploreThemes() {
    if (!selectedMovie || booksLoading) return

    setBooksLoading(true)
    setBookError('')
    setBooks([])
    setBroadSearch(true)

    try {
      const results = await getBooksForMovie(selectedMovie, { broad: true })
      setBooks(results)

      if (!results.length) {
        setBookError('No books were found, even with a broader search.')
      }
    } catch (err) {
      setBookError(err.message || 'Could not load books.')
    } finally {
      setBooksLoading(false)
    }
  }

  function clearSearch() {
    setQuery('')
    setMovies([])
    setSuggestions([])
    setSelectedMovie(null)
    setBooks([])
    setShowResults(false)
    setError('')
    setBookError('')
    setBroadSearch(false)
  }

  function updateQuery(value) {
    setQuery(value)
    setShowResults(false)
    setSelectedMovie(null)
    setError('')

    if (!value.trim()) {
      setMovies([])
      setSuggestions([])
      setBooks([])
    }
  }

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <section className="hero">
          <p className="eyebrow">YOUR NEXT OBSESSION STARTS HERE</p>
          <h1>
            Loved the movie?
            <br />
            <span>Read the feeling.</span>
          </h1>
          <p className="hero-description">
            Discover books inspired by the movies you love.
            One story leads to another.
          </p>

          <SearchBar
            query={query}
            setQuery={updateQuery}
            onSearch={handleSearch}
            loading={loading}
            suggestions={suggestions}
            onSelectMovie={selectMovie}
            onClear={clearSearch}
          />

          {error && <p className="status-message">{error}</p>}
        </section>

        {showResults ? (
          <>
            <MovieGrid movies={movies} onSelectMovie={selectMovie} />

            {selectedMovie && (
              <BookGrid
                movie={selectedMovie}
                books={books}
                loading={booksLoading}
                error={bookError}
                onExploreThemes={exploreThemes}
                onChooseAnotherMovie={clearSearch}
                broadSearch={broadSearch}
              />
            )}
          </>
        ) : (
          <>
            <section className="home-movie-section">
              <div className="section-heading">
                <p className="eyebrow">TRENDING DISCOVERIES</p>
                <h2>Popular movies</h2>
                <p>Stories everyone is talking about.</p>
              </div>

              {homeLoading ? (
                <p className="status-message">Loading popular movies...</p>
              ) : (
                <MovieGrid movies={popular} onSelectMovie={selectMovie} />
              )}
            </section>

            <section className="home-movie-section">
              <div className="section-heading">
                <p className="eyebrow">FRESH FROM THE THEATRES</p>
                <h2>Now playing</h2>
                <p>Movies currently showing in India.</p>
              </div>

              {homeLoading ? (
                <p className="status-message">Loading latest movies...</p>
              ) : (
                <MovieGrid movies={nowPlaying} onSelectMovie={selectMovie} />
              )}
            </section>

            <section className="experience-section">
              <p className="eyebrow">THE EXPERIENCE</p>
              <h2>One screen. Two worlds.</h2>

              <div className="feature-grid">
                <article className="feature-card">
                  <span>01</span>
                  <h3>Find your film</h3>
                  <p>Explore movie stories, genres, and worlds.</p>
                </article>
                <article className="feature-card">
                  <span>02</span>
                  <h3>Cross into books</h3>
                  <p>Discover books connected by subjects and themes.</p>
                </article>
                <article className="feature-card">
                  <span>03</span>
                  <h3>Follow the feeling</h3>
                  <p>Find your next read and keep the story going.</p>
                </article>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        Made for curious minds · Screen2Shelf
      </footer>
    </div>
  )
}

export default App
