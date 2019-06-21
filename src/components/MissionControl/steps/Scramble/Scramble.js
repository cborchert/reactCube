import React, { useEffect } from "react";
import "./Scramble.scss";
import { useCube } from "../../../../state/CubeContext.js";

const Scramble = ({
  onScrambleStep,
  scrambleSteps,
  nextScrambleStep,
  addScrambleStep
}) => {
  // Check newest move against the expected move
  const { moveHistory } = useCube();
  const lastMove = moveHistory[moveHistory.length - 1];
  const lastMoveNotation = lastMove && lastMove.move;
  // keeping a record of move time to ensure that we use our effect only once
  const lastMoveTime = lastMove && lastMove.time;
  const previousMoveTime = React.useRef(lastMoveTime);
  const expectedMoveNotation = scrambleSteps[onScrambleStep];
  useEffect(() => {
    // skip if our last move time is the same as this move time
    if (lastMoveTime === previousMoveTime.current) {
      return;
    } else {
      previousMoveTime.current = lastMoveTime;
    }
    if (lastMoveNotation) {
      // check if the last move was correct
      if (lastMoveNotation !== expectedMoveNotation) {
        // adds a tick, if tick is doubled, removes it
        const inverse = `${lastMoveNotation}'`.replace("''", "");
        addScrambleStep(inverse);
      } else {
        nextScrambleStep();
      }
    }
  }, [
    addScrambleStep,
    expectedMoveNotation,
    lastMoveNotation,
    lastMoveTime,
    nextScrambleStep,
    onScrambleStep,
    scrambleSteps.length
  ]);
  return (
    <React.Fragment>
      <div className="Scramble__header">
        <h2>Complete the Scramble</h2>
      </div>
      <div className="Scramble__footer">
        {scrambleSteps.map((step, i) => {
          let className = "Scramble__step";
          // set class based on completed or not
          if (onScrambleStep < i) {
            className += " Scramble__step--future";
          } else if (onScrambleStep > i) {
            className += " Scramble__step--past";
            // special class for even oldest steps
            if (onScrambleStep > i + 1) {
              className += " Scramble__step--ancient";
            }
          } else {
            className += " Scramble__step--current";
          }
          return (
            <span key={`${i}--${step}`} className={className}>
              {step}
            </span>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Scramble;
