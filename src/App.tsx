import { useState } from "react";
import { startTone, stopTone } from "./AudioContext";
import Pad from "./components/Pad";
import "./App.css";

function App() {
  const sequence = [0, 1, 2, 3];
  const interval = 500;
  const [activePad, setActivePad] = useState<number | null>(null);

  function playSequence() {
    sequence.forEach((event, i) => {
      const startTime = i * 500
      const stopTime = (interval * 0.9) + (i * 500)
      setTimeout(() => {
        startTone(event)
        setActivePad(event)
      }, startTime)

      setTimeout(() => {
          stopTone(event)
          setActivePad(null)
      }, stopTime)
    });
  }

  return (
    <div style={{ padding: "1em"}}>
      <svg
        style={{ aspectRatio: 1 }}
        viewBox="0 0 300 300"
      >
        <circle cx={150} cy={150} r={150} />
        <circle cx={150} cy={150} r={55} fill="grey" />
        <circle onClick={() => playSequence()} cx={150} cy={150} r={10} fill="red" />
        <Pad
          isActive={activePad === 0}
          padIndex={0}
          title="pad 1"
          d="
            M 160 80 
            L 160 15
            A 135 135 1 0 1 285 145
            L 220 145
            A 70 70 1 0 0 160 80
            z   
          "
          fill="hsl(0, 100%, 50%)"
        />
        <Pad
          isActive={activePad === 1}
          padIndex={1}
          title="pad 2"
          d="
            M 220 160 
            L 285 160
            A 135 135 1 0 1 160 285
            L 160 220
            A 70 70 1 0 0 220 160   
          "
          fill="hsl(120, 100%, 50%)"
        />
        <Pad
          isActive={activePad === 2}
          padIndex={2}
          title="pad 3"
          d="
            M 145 220 
            L 145 285
            A 135 135 1 0 1 15 160
            L 80 160
            A 70 70 1 0 0 145 220
            z
          "
          fill="hsl(240, 100%, 50%)"
        />
        <Pad
          isActive={activePad === 3}
          padIndex={3}
          title="pad 4"
          d="
            M 80 145 
            L 15 145
            A 135 135 1 0 1 145 15
            L 145 80
            A 70 70 1 0 0 80 145   
          "
          fill="rgb(255, 255, 0)"
        />
      </svg> 
    </div>
  );
}

export default App;
