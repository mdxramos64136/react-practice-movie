/* By putting the syle object here it wont be regenerated 
each time the component renders. */
const containerStyle = {
  display: "flex", // set the elements side by side
  alignItems: "center", // center the elements vertically
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
  gap: "4px",
};

const textStyle = {
  lineHeight: "1",
  margin: "0",
};

// setting the default value of maxRating to 5
// and destructuring the props object to get the value of maxRating
export default function StarRating({ maxRating = 5 }) {
  return (
    <>
      <div style={containerStyle}>
        <div style={starContainerStyle}>
          {Array.from({ length: maxRating }, (_, i) => (
            <span>S{i + 1}</span>
          ))}
        </div>
        <p style={textStyle}>10</p>
      </div>
    </>
  );
}

/**Array.from
 * 1 - enter in JS mode
 * 2 - Specify  the length property of the array to be created
 * 3 - , loop over by passing a function (like map) as a second argument
 * 4 - (_) is the placeholder var as we are not interested in the element themselves.
 * We are interested in the number i.
 */
