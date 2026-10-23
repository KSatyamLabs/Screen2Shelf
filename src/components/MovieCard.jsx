
import { TMDB_IMAGE_URL } from '../services/tmdb'

function MovieCard({ movie, onSelect }) {
  const year = movie.release_date?.slice(0, 4)

  return (
    <button
      type="button"
      className="movie-card"
      onClick={() => onSelect?.(movie)}
      aria-label={`Explore books related to ${movie.title}`}
      style={{
        display: 'block',
        width: '100%',
        padding: 0,
        textAlign: 'left',
        color: 'inherit',
        font: 'inherit',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {movie.poster_path ? (
        <div className="movie-poster-wrapper">
          <img
            className="movie-poster"
            src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
            alt={`${movie.title} poster`}
            loading="lazy"
          />
          <div className="poster-overlay" />
        </div>
      ) : (
        <div className="poster-placeholder">No poster available</div>
      )}

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-year">{year || 'Release year unknown'}</p>
        <p className="movie-rating">
          <span className="rating-star">★</span>{' '}
          {movie.vote_average
            ? movie.vote_average.toFixed(1)
            : 'Not rated'}
          <span className="rating-out-of"> / 10</span>
        </p>
        <p className="movie-overview">
          {movie.overview || 'No overview available.'}
        </p>
      </div>
    </button>
  )
}

export default MovieCard
