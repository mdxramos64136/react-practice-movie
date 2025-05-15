import React, { useState } from "react";
import ReactDOM from "react-dom/client";
//import "./index.css";
//import App from "./App";
import StarRating from "./StarRating";

//Using in a an external component:
function Test() {
  //state to set the rating:
  //When called in the StarRating.js component, setExtRating will
  // update the state extRating
  const [extRating, setExtRating] = useState(0);

  return (
    <>
      <StarRating maxRating={5} size={20} color="purple" onExtRating={setExtRating} />
      <p>This movie recieved {extRating} stars!</p>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Passing a prop to be used in StarRatings.js file */}
    <StarRating maxRating={5} messages={["Terrible", "Bad", "Okey", "Good", "Amazing"]} />
    <StarRating maxRating={10} size={15} color="#16b1b1" defaultRating={3} />
    <Test />
  </React.StrictMode>
);
