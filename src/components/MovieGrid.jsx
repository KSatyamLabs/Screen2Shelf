
import MovieCard from './MovieCard'

function MovieGrid({ movies, onSelectMovie }) {
  if (!movies.length) return null

  return (
    <section className="results-section">
      <div className="section-heading">
        <p className="eyebrow">YOUR SEARCH RESULTS</p>
        <h2>Choose your movie</h2>
        <p>Select a film to explore related reading.</p>
      </div>

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={onSelectMovie}
          />
        ))}
      </div>
    </section>
  )
}

export default MovieGrid
