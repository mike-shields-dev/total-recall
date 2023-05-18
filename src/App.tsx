import { useState } from "react";
import { synth } from "./AudioEngine";
import { padNotes } from "./globals";
import * as Tone from "tone";
import Pad from "./components/Pad";
import "./App.css";

const BPM = 120

function App() {
  const [activeTone, setActiveTone] = useState<number>(-1);
  const [uiDisabled, setUiDisabled] = useState(false);

  function playPattern(events: number[]) {
    setUiDisabled(true);
    
    Tone.Transport
      .stop()
      .cancel()
      .set({ bpm: BPM })

    const noteDuration = 0.3 * (60 / BPM);
    const padLightDuration = 1000 * noteDuration;
    
    const pattern  = new Tone.Sequence((time, eventsItem) => {
      if(eventsItem === -1) return setUiDisabled(false);

      synth.triggerAttackRelease(padNotes[eventsItem], noteDuration);
      setTimeout(() => setActiveTone(-1), padLightDuration);
      setActiveTone(eventsItem);
    }, events).start(0);
  
    pattern.loop = false;
    
    Tone.Transport.start();
  }

  function generateEvents(length: number) {
    const events: number[] = [];

    while(events.length < length) {
      const event = Math.floor(Math.random() * 4);
      
      if(`${events.slice(-2)}` === `${[event, event]}`) continue;
      
      events.push(event);
    }

    return [...events, -1];
  }

  function handleStart() {
    playPattern(generateEvents(8));
  }

  return (
    <div style={{ padding: "1em"}}>
      <svg
        style={{ aspectRatio: 1 }}
        viewBox="0 0 300 300"
      >
        <circle cx={150} cy={150} r={150} />
        <circle cx={150} cy={150} r={55} fill="grey" />
        <circle onClick={handleStart} cx={150} cy={150} r={10} fill="red" />
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
