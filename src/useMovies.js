import { useEffect, useState } from "react";

//if a var does not depend on anything inside the component, just declare it outside.
const KEY = "4098128";

export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(
    //the function will only be called if it actually exists.
    function () {
      //callback?.();
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

      //handleCloseMovie(); //close the movie detail when a new search occours
      fetchMovies();

      return function () {
        controller.abort();
      };
    }, //outter function,
    [query]
  ); //useEffect
  return { movies, isLoading, error };
}
