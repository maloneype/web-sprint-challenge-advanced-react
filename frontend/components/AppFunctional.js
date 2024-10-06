import React, { useState } from "react";

// Suggested initial states
const initialCoordinateMessage = "Coordinates (2, 2)";
const initialMoveMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [stepCount, setStepCount] = useState(initialSteps);
  const [coordinateMessage, setCoordinateMessage] = useState(
    initialCoordinateMessage
  );
  const [moveMessage, setMoveMessage] = useState(initialMoveMessage);
  const [userEmail, setEmail] = useState(initialEmail);

  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  function getY(index) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    if (index >= 0 && index < 3) {
      return 1;
    } else if (index >= 3 && index < 6) {
      return 2;
    }
    return 3;
  }

  function getX(index) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    if (index === 0 || index === 3 || index === 6) {
      return 1;
    } else if (index === 1 || index === 4 || index === 7) {
      return 2;
    }
    return 3;
  }

  function getXYMessage(index) {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const x = getX(index);
    const y = getY(index);
    return "Coordinates (" + x + ", " + y + ")";
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setCurrentIndex(initialIndex);
    setStepCount(initialSteps);
    setCoordinateMessage(initialCoordinateMessage);
    setMoveMessage(initialMoveMessage);
    setEmail(initialEmail);
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const id = evt.target.id;
    let index = currentIndex;

    if (id === "reset") reset();

    if (id === "left") {
      if (index === 0 || index === 3 || index === 6) {
        setMoveMessage("You can't go left");
      } else {
        setMoveMessage("");
        index--;
        setCurrentIndex(index);
        setStepCount(stepCount + 1);
      }
    }
    if (id === "right") {
      if (index === 2 || index === 5 || index === 8) {
        setMoveMessage("You can't go right");
      } else {
        setMoveMessage("");
        index++;
        setCurrentIndex(index);
        setStepCount(stepCount + 1);
      }
    }
    if (id === "up") {
      if (index < 3) {
        setMoveMessage("You can't go up");
      } else {
        setMoveMessage("");
        index = index - 3;
        setCurrentIndex(index);
        setStepCount(stepCount + 1);
      }
    }
    if (id === "down") {
      if (index > 5) {
        setMoveMessage("You can't go down");
      } else {
        setMoveMessage("");
        index = index + 3;
        setCurrentIndex(index);
        setStepCount(stepCount + 1);
      }
    }

    setCoordinateMessage(getXYMessage(index));
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  function handleSubmit(evt) {
    // Use a POST request to send a payload to the server.
    // { "x": 1, "y": 2, "steps": 3, "email": "lady@gaga.com" }
    evt.preventDefault();
    const payload = {
      x: getX(currentIndex),
      y: getY(currentIndex),
      steps: stepCount,
      email: userEmail,
    };
    fetch("http://localhost:9000/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMoveMessage(data.message);
        setEmail("");
      })
      .catch((err) => {
        console.error("error", err);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{coordinateMessage}</h3>
        <h3 id="steps">
          You moved {stepCount} time{stepCount === 1 ? "" : "s"}
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === currentIndex ? " active" : ""}`}
          >
            {idx === currentIndex ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{moveMessage}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>
          LEFT
        </button>
        <button id="up" onClick={move}>
          UP
        </button>
        <button id="right" onClick={move}>
          RIGHT
        </button>
        <button id="down" onClick={move}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          onChange={onChange}
          value={userEmail}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
