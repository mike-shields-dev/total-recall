import "./App.css";
import { startTone, stopTone } from "./AudioContext";
import Pad from "./components/Pad";

function App() {
  return (
    <>
      <svg
        style={{ border: "1px solid red", aspectRatio: 1 }}
        viewBox="0 0 300 300"
      >
        <circle cx={150} cy={150} r={150} />
        <circle cx={150} cy={150} r={55} fill="grey" />
        <Pad
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
    </>
  );
}

export default App;
