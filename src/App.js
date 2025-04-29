import { useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
//Fixing Prop drilling. Remember: With {children} you can pass any content to the
//child compoonent. In the parente, you just nee to use opening and closing tag
export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  return (
    <>
      <NavBar moviesProp={movies} />
      <Main moviesProp={movies} />
    </>
  );
}
////////////////////////////////////////////////////////////////////
function NavBar({ moviesProp }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <SearchBar />
      <NumResults moviesProp={moviesProp} />
    </nav>
  );
}
//////////////////////////////////////////////////////////////////////
function SearchBar() {
  const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

//////////////////////////////////////////////////////////////////////
//Presentational component
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
//////////////////////////////////////////////////////////////////////
//Presentational component
function NumResults({ moviesProp }) {
  return (
    <p className="num-results">
      Found <strong>{moviesProp.length}</strong> results
    </p>
  );
}

//////////////////////////////////////////////////////////////////////

function Main({ moviesProp }) {
  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <main className="main">
      <ListBox moviesProp={moviesProp} />
      <WatchedBox
        watchedProp={watched}
        setWatchedProp={setWatched}
      />
    </main>
  );
}

//////////////////////////////////////////////////////////////////////
function ListBox({ moviesProp }) {
  const [isOpen1, setIsOpen1] = useState(true);

  // Obs.1: Por que o onClick tem apenas () e não (e)?
  // Porque não precisamos do evento, só queremos mudar o estado.
  // O evento (e) não está sendo usado dentro da função. Vc nao precisa acessar
  // info do evento.
  // Assim (), vc só está chamando a funcao. Só queremos mudar o valor de isOpen
  // Obs.2: No React, false, null, e undefined são "não renderizáveis".
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}>
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && <MovieList watchedProp={moviesProp} />}
    </div>
  );
}
///////////////////////////////////////////////////////////////////////
function MovieList({ watchedProp }) {
  return (
    <ul className="list">
      {watchedProp.map((movie) => (
        <Movie
          movieMapProp={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
//////////////////////////////////////////////////////////////////////
function Movie({ movieMapProp }) {
  return (
    <li>
      <img
        src={movieMapProp.Poster}
        alt={`${movieMapProp.Title} poster`}
      />
      <h3>{movieMapProp.Title}</h3>
      <p>📅 {movieMapProp.Year}</p>
    </li>
  );
}

///////////////////////////////////////////////////////////////////////
function WatchedBox({ watchedProp, setWatchedProp }) {
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}>
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSumary watchedProp={watchedProp} />
          <WatchedMovieList watchedProp={watchedProp} />
        </>
      )}
    </div>
  );
}
///////////////////////////////////////////////////////////////////////
function WatchedSumary({ watchedProp }) {
  // watchedProp.map((movie) => movie.imdbRating) cria um array só com
  // as notas imdbRating quem em seguida é passado p/ a função average p/
  // calcular a média.
  const avgImdbRating = average(watchedProp.map((movie) => movie.imdbRating));
  const avgUserRating = average(watchedProp.map((movie) => movie.userRating));
  const avgRuntime = average(watchedProp.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watchedProp.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
////////////////////////////////////////////////////////////////////////
function WatchedMovieList({ watchedProp }) {
  return (
    <ul className="list">
      {watchedProp.map((movie) => (
        <WatchedMovie
          movieMapProp={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}
///////////////////////////////////////////////////////////////////////

function WatchedMovie({ movieMapProp }) {
  return (
    <li key={movieMapProp.imdbID}>
      <img
        src={movieMapProp.Poster}
        alt={`${movieMapProp.Title} poster`}
      />
      <h3>{movieMapProp.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movieMapProp.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movieMapProp.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movieMapProp.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
