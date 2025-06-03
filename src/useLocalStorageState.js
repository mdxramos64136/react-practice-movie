// As the intention is to build a reusable hook, I changed the name
// of sthe state here to a more generica one. So:
// watched -> data & setWatched = setData
// The same applies to the name of the key.
// watched -> key

import { useState, useEffect } from "react";

export function useLocalStorageState(initialState, key) {
  const [data, setData] = useState(function () {
    const myStorage = localStorage.getItem(key);
    return myStorage ? JSON.parse(myStorage) : initialState;
  });

  //Storing data using useEffect.
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(data));
    },
    [data, key]
  );
  return [data, setData];
} //useLocalStorageState
