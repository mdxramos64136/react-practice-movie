import React from "react";
import ReactDOM from "react-dom/client";
//import "./index.css";
//import App from "./App";
import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Passing a prop to be used in StarRatings.js file */}
    <StarRating masRating={5} />
  </React.StrictMode>
);
