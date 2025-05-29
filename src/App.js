import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//if a var does not depend on anything inside the component, just declare it outside.
const KEY = "4098128";
//Fixing Prop drilling. Remember: With {children} you can pass any content to the
//child compoonent. In the parent, you just need to use opening and closing tag <open> any content </open>
// In the child, just put {children} where you want to render the content, which will fetch again
// and set the movies again as well. The whole thing starts over and over again
export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  //const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(function () {
    const myStorage = localStorage.getItem("watched");
    return JSON.parse(myStorage);
  });

  function handleSelectedMovie(id) {
    // id will be get when user click on the movies <li>
    setSelectedId(selectedId === id ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
    handleCloseMovie();

    //localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  //If dif. it will remain in the watched array (state). If id is the same,
  // it will be filtered out/ be deleted.
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  //Storing data using useEffect.
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal } // connecting the board controller with the fetch
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies!");

          // data will the the result of convertting the response (res) to json
          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found!");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.message !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      } // fetchMovies
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      handleCloseMovie(); //close the movie detail when a new search occours
      fetchMovies();

      return function () {
        controller.abort();
      };
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
              onCloseP={handleCloseMovie}
              onAddWatched={handleAddedMovie}
              watchedProp={watched}
            />
          ) : (
            <>
              <WatchedSumary watchedProp={watched} />
              <WatchedMovieList
                watchedProp={watched}
                onDeleteWatched={handleDeleteWatched}
              />
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
// remember> .current acces the value of the ref (inputelement)
// Putting focus on element. It activates the field for typing immediately
// put the callback function out of the addeventListener so that you can clean it up later.
function SearchBar({ queryProp, setQueryProp }) {
  const inputElement = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputElement.current) return;

        if (e.code === "Enter") {
          inputElement.current.focus();
          setQueryProp("");
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
    },
    [setQueryProp]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={queryProp}
      onChange={(e) => setQueryProp(e.target.value)}
      ref={inputElement}
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
function MovieDetails({ selectedIdProp, onCloseP, onAddWatched, watchedProp }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  //true or false
  const isWatched = watchedProp
    .map((movie) => movie.imdbID)
    .includes(selectedIdProp);

  //.? conditional chaining is necessary here so that userRating will only
  // be accessed if movie is in the list(selectedIdProp)
  const watchedUserRating = watchedProp.find(
    (movie) => movie.imdbID === selectedIdProp
  )?.userRating;

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

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedIdProp,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddWatched(newWatchedMovie);
    //onCloseP();
  }

  useEffect(
    function () {
      function calbackEsc(e) {
        if (e.code === "Escape") onCloseP();
      }

      document.addEventListener("keydown", calbackEsc);

      return function () {
        document.removeEventListener("keydown", calbackEsc);
      };
    },
    [onCloseP]
  );

  //Each time this component mounts, The movie correspondind to the selectedID
  //we be fetched.
  useEffect(
    function () {
      async function getMoviesDetails() {
        setIsLoading(true);

        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedIdProp}`
        );
        const data = await res.json();

        setMovie(data);
        setIsLoading(false);
      }
      getMoviesDetails();
    },
    [selectedIdProp]
  );

  //Changing the title of the page accondding with the movie  selected
  //Setting the clean up function, a function the we return from an effect
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "Movie App";
      };
    },
    [title]
  );
  ///////////////////
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseP}>
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
          <section>
            <div className="rating">
              {!isWatched ? (
                <StarRating
                  maxRating={10}
                  size={30}
                  onExtRating={setUserRating}
                />
              ) : (
                <p>You rated this movie: {watchedUserRating} 🌟</p>
              )}
            </div>

            {userRating > 0 && (
              <button onClick={handleAdd} className="btn-add">
                + Add to Watched List
              </button>
            )}

            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
//////////////////////////////////////////////////////////////////////
function WatchedSumary({ watchedProp }) {
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
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
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
function WatchedMovieList({ watchedProp, onDeleteWatched }) {
  return (
    <ul className="list">
      {watchedProp.map((movie) => (
        <WatchedMovie
          movieMapProp={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
///////////////////////////////////////////////////////////////////////

function WatchedMovie({ movieMapProp, onDeleteWatched }) {
  return (
    <li key={movieMapProp.imdbID}>
      <img src={movieMapProp.poster} alt={`${movieMapProp.title} poster`} />
      <h3>{movieMapProp.title}</h3>
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

        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movieMapProp.imdbID)}>
          X
        </button>
      </div>
    </li>
  );
}
