import { useState } from "react";
import PropTypes from "prop-types";

/* By putting the syle object here it wont be regenerated 
each time the component renders. */
const containerStyle = {
  display: "flex", // set the elements side by side
  alignItems: "center", // center the elements vertically
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
};

// Setting the type of props...
StarRating.propTypes = {
  maxRating: PropTypes.number,
  defaultRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  messages: PropTypes.array,
  className: PropTypes.string,
  onExtRating: PropTypes.func,
};

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onExtRating,
}) {
  //In this case specifically, there is no problem to set the state with the prop  value as it wont be
  const [rating, setRating] = useState(defaultRating);
  const [hover, setHover] = useState(0); // This is used to highlight the stars when hovering over them

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${30}px`, //if the property has the same name you dont need to expecify color: colorProp (this one comes from the {...})
  };

  function handleRating(ratingGiven) {
    setRating(ratingGiven);
    onExtRating(ratingGiven);
  }

  return (
    <>
      <div style={containerStyle} className={className}>
        <div style={starContainerStyle}>
          {Array.from({ length: maxRating }, (_, i) => (
            <Star
              key={i}
              onClickProp={() => handleRating(i + 1)} //When the click happens, execute this anonymous function that calls handleRating
              full={hover ? hover >= i + 1 : rating >= i + 1}
              hoverInProp={() =>
                setHover(i + 1)
              } /*set to the rating of the current star */
              hoverOutProp={() =>
                setHover(0)
              } /*set to 0 when mouse leaves the star */
              colorProp={color}
              sizeProp={size}
            />
          ))}
        </div>
        {/* 1st, we need to check if there are  messages in the array and also if its nº 
        is = to the number of stars (masRating). Ex.: it doesn't male sennse if we have 5 stars ans 2 msgs. 
        If so, display message at the same position of the star. -1 because we need 
        to convert to 0 base array, as rating was add to 1 before( i+1)*/}
        <p style={textStyle}>
          {messages.length === maxRating
            ? messages[hover ? hover - 1 : rating - 1]
            : hover || rating || 0}
        </p>
      </div>
    </>
  );
}

function Star({
  onClickProp,
  full,
  hoverInProp,
  hoverOutProp,
  sizeProp,
  colorProp,
}) {
  const starStyle = {
    width: `${sizeProp}px`,
    height: `${sizeProp}px`,
    display: "block",
    cursor: "pointer",
  };
  //
  return (
    <span
      style={starStyle}
      onClick={onClickProp}
      onMouseEnter={hoverInProp}
      onMouseLeave={hoverOutProp}>
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={colorProp}
          stroke={colorProp}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={colorProp}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

/*
FULL STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="#000"
  stroke="#000"
>
  <path
    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
  />
</svg>


EMPTY STAR

<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="#000"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="{2}"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>

*/
