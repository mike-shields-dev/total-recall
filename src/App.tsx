import { useState } from "react";
import { startTone, stopTone } from "./AudioContext";
import Pad from "./components/Pad";
import "./App.css";

function App() {
  const sequence = [0, 1, 2, 3, 3, 1, 0, 2, 1, 2, 0, 3];
  const interval = 500;
  const [activeTone, setActiveTone] = useState<number>(-1);
  const [uiDisabled, setUiDisabled] = useState(false);

  function playSequence() {
    if(uiDisabled) return;

    sequence.forEach((event, i) => {
      const startTime = i * 500
      const stopTime = (interval * 0.9) + (i * 500)
      setUiDisabled(true);

      setTimeout(() => {
        startTone(event)
        setActiveTone(event)
      }, startTime)

      setTimeout(() => {
          stopTone(event)
          setActiveTone(-1)
          if(event === sequence.at(-1)) {
            setUiDisabled(false)
          }
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
          uiDisabled={uiDisabled}
          activeTone={activeTone}
          padIndex={0}
          title="pad 1"
          pathData="
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
          uiDisabled={uiDisabled}
          activeTone={activeTone}
          padIndex={1}
          title="pad 2"
          pathData="
            M 220 160 
            L 285 160
            A 135 135 1 0 1 160 285
            L 160 220
            A 70 70 1 0 0 220 160
            z  
          "
          fill="hsl(120, 100%, 50%)"
        />
        <Pad
          uiDisabled={uiDisabled}
          activeTone={activeTone}
          padIndex={2}
          title="pad 3"
          pathData="
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
          uiDisabled={uiDisabled}
          activeTone={activeTone}
          padIndex={3}
          title="pad 4"
          pathData="
            M 80 145 
            L 15 145
            A 135 135 1 0 1 145 15
            L 145 80
            A 70 70 1 0 0 80 145 
            z  
          "
          fill="rgb(255, 255, 0)"
        />
      </svg> 
    </div>
  );
}

export default App;
