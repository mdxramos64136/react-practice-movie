import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
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
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
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

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//if a var does not depend on a ything inside the component, just declare it outside.
const KEY = "4098128";
//Fixing Prop drilling. Remember: With {children} you can pass any content to the
//child compoonent. In the parent, you just need to use opening and closing tag <open> any content </open>
// In the child, just put {children} where you want to render the content, which will fetch again
// and set the movies again as well. The whole thing starts over and over again
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const query = "Star Wars";

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies!");

          // data will the the result of convertting the response (res) to json
          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found!");

          setMovies(data.Search);
        } catch (err) {
          console.log(err.message);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      } // fetchMovies
      fetchMovies();
    }, //outter function,
    []
  ); //useEffect

  return (
    <>
      <NavBar>
        <SearchBar />
        <NumResults moviesProp={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Load /> : <MovieList moviesProp={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList moviesProp={movies} />}
          {error && <ErrorMessage messageProp={error} />}
        </Box>
        <Box>
          <>
            <WatchedSumary watchedProp={watched} />
            <WatchedMovieList watchedProp={watched} />
          </>
        </Box>
      </Main>
    </>
  );
}
////////////////////////////////////////////////////////////////////
function Loader() {
  return <p className="loader">Loanding...</p>;
}
////////////////////////////////////////////////////////////////////
function ErrorMessage({ messageProp }) {
  return (
    <p className="error">
      <span>⛔</span>
      {messageProp}
    </p>
  );
}
////////////////////////////////////////////////////////////////////
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
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

function Main({ children }) {
  return <main className="main">{children}</main>;
}

//////////////////////////////////////////////////////////////////////
//Both WatchedBox and ListBox now became a reusable component called Box.
// Now , element(can be any name), replaced children in the ().
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}{" "}
    </div>
  );
}
///////////////////////////////////////////////////////////////////////
function MovieList({ moviesProp }) {
  return (
    <ul className="list">
      {moviesProp.map((movie) => (
        <Movie movieMapProp={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
//////////////////////////////////////////////////////////////////////
function Movie({ movieMapProp }) {
  return (
    <li>
      <img src={movieMapProp.Poster} alt={`${movieMapProp.Title} poster`} />
      <h3>{movieMapProp.Title}</h3>
      <p>📅 {movieMapProp.Year}</p>
    </li>
  );
}

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
        <WatchedMovie movieMapProp={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
///////////////////////////////////////////////////////////////////////

function WatchedMovie({ movieMapProp }) {
  return (
    <li key={movieMapProp.imdbID}>
      <img src={movieMapProp.Poster} alt={`${movieMapProp.Title} poster`} />
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
