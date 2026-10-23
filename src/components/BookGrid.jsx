
import { useState } from 'react'

const coverStyles = [
  { background: 'linear-gradient(145deg, #302044, #120f19)', accent: '#d4a8ff' },
  { background: 'linear-gradient(145deg, #173c3b, #101b25)', accent: '#9de2ce' },
  { background: 'linear-gradient(145deg, #583127, #20151c)', accent: '#ffc6a1' },
  { background: 'linear-gradient(145deg, #263451, #10121e)', accent: '#b6cbff' },
  { background: 'linear-gradient(145deg, #493b1d, #201817)', accent: '#f4d88a' },
]

function BookCover({ book, index }) {
  const [failed, setFailed] = useState(false)
  const style = coverStyles[index % coverStyles.length]
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg?default=false`
    : null

  return (
    <div
      className="movie-poster-wrapper"
      style={{
        aspectRatio: '2 / 3',
        position: 'relative',
        overflow: 'hidden',
        background: style.background,
      }}
    >
      {coverUrl && !failed && (
        <img
          className="movie-poster"
          src={coverUrl}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          onError={() => setFailed(true)}
          onLoad={(event) => {
            if (event.currentTarget.naturalWidth <= 1) setFailed(true)
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {(!coverUrl || failed) && (
        <div
          role="img"
          aria-label={`Decorative cover for ${book.title}`}
          style={{
            position: 'absolute',
            inset: 0,
            padding: '18px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'center',
            color: style.accent,
            border: `1px solid ${style.accent}40`,
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: 3 }}>SCREEN2SHELF</span>
          <div>
            <div style={{ marginBottom: 14 }}>━━━━</div>
            <h3
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: 22,
                lineHeight: 1.2,
                overflowWrap: 'anywhere',
              }}
            >
              {book.title}
            </h3>
            <p style={{ fontSize: 11, opacity: 0.75 }}>
              {book.author_name?.[0] || 'Unknown author'}
            </p>
          </div>
          <span style={{ fontSize: 9, letterSpacing: 1 }}>
            COVER UNAVAILABLE
          </span>
        </div>
      )}
    </div>
  )
}

function BookGrid({
  books,
  movie,
  loading,
  error,
  onExploreThemes,
  onChooseAnotherMovie,
  broadSearch,
}) {
  const empty = !loading && !error && books.length === 0

  return (
    <section className="results-section">
      <div className="section-heading">
        <p className="eyebrow">YOUR NEXT CHAPTER</p>
        <h2>Books for {movie.title}</h2>
        <p>
          Explore reading suggestions inspired by this movie's story and themes.
          These are not confirmed adaptations.
        </p>
      </div>

      {loading && (
        <p className="status-message">Discovering books...</p>
      )}

      {error && <p className="status-message">{error}</p>}

      {empty && (
        <div
          style={{
            padding: '36px 20px',
            marginTop: 24,
            textAlign: 'center',
            border: '1px solid #302637',
            borderRadius: 16,
            background: 'linear-gradient(145deg, #151119, #0e0d10)',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }} aria-hidden="true">
            📚
          </div>
          <h3 style={{ marginBottom: 10 }}>No books found just yet</h3>
          <p
            style={{
              maxWidth: 440,
              margin: '0 auto 22px',
              color: '#aaa2b4',
              lineHeight: 1.7,
            }}
          >
            We couldn't find matching books for this movie.
            Try a broader search based on its themes, or explore another film.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <button
              type="button"
              className="search-button"
              onClick={onExploreThemes}
              disabled={loading || broadSearch}
            >
              {broadSearch ? 'Searching themes...' : 'Explore similar themes'}
            </button>

            <button
              type="button"
              className="clear-button"
              onClick={onChooseAnotherMovie}
            >
              <button
                type="button"
                onClick={onChooseAnotherMovie}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: '1px solid #493650',
                  background: 'rgba(198, 156, 255, 0.08)',
                  color: '#c69cff',
                  fontFamily: 'inherit',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                Choose another movie
              </button>
            </button>
          </div>
        </div>
      )}

      <div className="movie-grid">
        {books.map((book, index) => (
          <a
            className="movie-card"
            href={`https://openlibrary.org${book.key}`}
            target="_blank"
            rel="noreferrer"
            key={book.key}
            style={{
              display: 'block',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <BookCover book={book} index={index} />

            <div className="movie-info">
              <h3 className="movie-title">{book.title}</h3>
              <p className="movie-year">
                {book.first_publish_year || 'Publication year unknown'}
              </p>
              <p className="movie-overview">
                {book.author_name?.join(', ') || 'Author unknown'}
              </p>
              <p className="movie-rating">Explore book ↗</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default BookGrid
