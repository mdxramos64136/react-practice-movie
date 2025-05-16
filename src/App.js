import { useEffect, useState } from "react";
import StarRating from "./StarRating";

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
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectedMovie(id) {
    // id will be get when user click on the movies <li>
    setSelectedId(selectedId === id ? null : id);
  }

  function handleCloseSelected() {
    setMovies([]);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

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
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      } // fetchMovies
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
    }, //outter function,
    [query]
  ); //useEffect

  return (
    <>
      <NavBar>
        <SearchBar queryProp={query} setQueryProp={setQuery} />
        <NumResults moviesProp={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Load /> : <MovieList moviesProp={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              moviesProp={movies}
              onSelectedMovieP={handleSelectedMovie}
            />
          )}
          {error && <ErrorMessage messageProp={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedIdProp={selectedId}
              onCloseP={handleCloseSelected}
            />
          ) : (
            <>
              <WatchedSumary watchedProp={watched} />
              <WatchedMovieList watchedProp={watched} />
            </>
          )}
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
function SearchBar({ queryProp, setQueryProp }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={queryProp}
      onChange={(e) => setQueryProp(e.target.value)}
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
function MovieList({ moviesProp, handleClick, onSelectedMovieP }) {
  return (
    <ul className="list list-movies">
      {moviesProp.map((movie) => (
        <Movie
          movieMapProp={movie}
          key={movie.imdbID}
          handleClickProp={handleClick}
          onSelectedMovieP={onSelectedMovieP}
        />
      ))}
    </ul>
  );
}
//////////////////////////////////////////////////////////////////////
function Movie({ movieMapProp, onSelectedMovieP }) {
  return (
    <li onClick={() => onSelectedMovieP(movieMapProp.imdbID)}>
      <img src={movieMapProp.Poster} alt={`${movieMapProp.Title} poster`} />
      <h3>{movieMapProp.Title}</h3>
      <p>📅 {movieMapProp.Year}</p>
    </li>
  );
}
//////////////////////////////////////////////////////////////////////
function MovieDetails({ selectedIdProp, onCloseP }) {
  const [movie, setMovie] = useState({});

  //destructuring data out of the movie obj and giving properties a lowercase name:
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  //Each time this component mounts, The movie correspondind to the selectedID
  //we be fetched.
  useEffect(
    function () {
      async function getMoviesDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedIdProp}`
        );
        const data = await res.json();

        setMovie(data);
      }
      getMoviesDetails();
    },
    [selectedIdProp]
  );

  return (
    <div className="details">
      <header>
        <button className="btn-black" onClick={onCloseP}>
          &larr;
        </button>

        <img src={poster} alt={`Posster of ${movie} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐️</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <div className="rating">
        <StarRating maxRating={10} size={30} />
      </div>

      <section>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}
//////////////////////////////////////////////////////////////////////
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
