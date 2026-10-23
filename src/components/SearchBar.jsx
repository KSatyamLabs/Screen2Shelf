
import { TMDB_IMAGE_URL } from '../services/tmdb'

function SearchBar({
  query,
  setQuery,
  onSearch,
  loading,
  suggestions,
  onSelectMovie,
  onClear,
}) {
  return (
    <div className="search-wrapper">
      <form className="search-form" onSubmit={onSearch}>
        <input
          className="search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search a movie, e.g. Interstellar..."
          aria-label="Search for a movie"
          autoComplete="off"
        />

        {query && (
          <button
            className="clear-button"
            type="button"
            onClick={onClear}
            aria-label="Clear search"
          >
            ×
          </button>
        )}

        <button
          className="search-button"
          type="submit"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : 'Search →'}
        </button>
      </form>

      {suggestions.length > 0 && query.trim() && (
        <div className="suggestions-list">
          {suggestions.map((movie) => (
            <button
              className="suggestion-item"
              type="button"
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
            >
              {movie.poster_path ? (
                <img
                  src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
                  alt=""
                />
              ) : (
                <div className="suggestion-placeholder" />
              )}
              <span className="suggestion-text">
                <strong>{movie.title}</strong>
                <small>{movie.release_date?.slice(0, 4) || 'Year unknown'}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar