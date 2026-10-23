# Screen2Shelf

**Loved the movie? Read the feeling.**

Screen2Shelf is a movie discovery web app that helps you discover books inspired by the stories, themes, and genres of your favorite movies.

**[Live Demo](https://screen2-shelf.vercel.app/)** · **[GitHub Repository](https://github.com/KSatyamLabs/Screen2Shelf)**

## Preview

<!-- Add your screenshot after saving it to screenshots/homepage.png -->

![Screen2Shelf homepage](screenshots/homepage.png)

## Features

- **Movie Search** — Search for movies by title with autocomplete suggestions.
- **Discover Movies** — Explore popular movies and movies currently playing in India.
- **Book Recommendations** — Find books related to a selected movie's title, story, and genres.
- **Explore Similar Themes** — Broaden book discovery to find more recommendations.
- **Dark-Themed Interface** — Explore movies and books through a modern, responsive UI.

## Tech Stack

- **Frontend:** React, JavaScript, Vite
- **Styling:** CSS
- **Movie Data:** [The Movie Database (TMDB)](https://www.themoviedb.org/)
- **Book Data:** [Open Library](https://openlibrary.org/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) with npm
- A TMDB API credential

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KSatyamLabs/Screen2Shelf.git
   cd Screen2Shelf
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and add your TMDB credential:

   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_credential
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

### Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## APIs and Acknowledgements

- Movie information and movie artwork are provided by [TMDB](https://www.themoviedb.org/).
- Book search results and available cover images are provided by [Open Library](https://openlibrary.org/).

This product uses the TMDB API but is not endorsed or certified by TMDB.

## Environment Variables and Security

- Do not commit your `.env` file or publish credentials in your source code.
- Variables prefixed with `VITE_` are exposed in browser-side code. Treat the TMDB credential used by this frontend as visible to users.
- Keep `.env` excluded through `.gitignore`.

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Satyam Kalapahad
