import { useState, useEffect } from "react";
import PubSub from "pubsub-js";

import {
  ACTIVE_PAD_INDEX,
  SEQUENCER_PLAY,
  SEQUENCE_ENDED,
  SEQUENCE_STARTED,
} from "./AudioEngine/PubSubNameSpace";

import "./App.css";
import Pads from "./components/Pads";

function App() {
  const [activePadIndex, setActivePadIndex] = useState<number>(-1);
  const [uiDisabled, setUiDisabled] = useState(false);
  const [sequence, setSequence] = useState<number[]>([-1]);

  function handleStart() {
    if(uiDisabled) return;
    const nextSequence = [...sequence.slice(0, -1), Math.floor(Math.random() * 4), -1]
    setUiDisabled(true);
    PubSub.publish(SEQUENCER_PLAY, nextSequence);
    setSequence(nextSequence);
  }

  useEffect(() => {
    const onSequenceStarted = PubSub.subscribe(SEQUENCE_STARTED, () =>
      setUiDisabled(true)
    );
    const onSequenceEnded = PubSub.subscribe(SEQUENCE_ENDED, () =>
      setUiDisabled(false)
    );
    const onActivePadIndex = PubSub.subscribe(ACTIVE_PAD_INDEX, (_, padIndex) =>
      setActivePadIndex(padIndex)
    );

    return () => {
      PubSub.unsubscribe(onSequenceStarted);
      PubSub.unsubscribe(onSequenceEnded);
      PubSub.unsubscribe(onActivePadIndex);
    };
  }, []);

  return (
    <div style={{ padding: "1em" }}>
      <svg style={{ aspectRatio: 1 }} viewBox="0 0 300 300">
        <circle cx={150} cy={150} r={150} />
        <circle cx={150} cy={150} r={55} fill="grey" onClick={handleStart} />
        <circle onClick={handleStart} cx={150} cy={150} r={10} fill="red" />
        <path d="M 145 145 L 154 150 L145 155 z" transform="translate(2, 0)" pointerEvents="none" />

        <Pads uiDisabled={uiDisabled} activePadIndex={activePadIndex} />
      </svg>
    </div>
  );
}

export default App;
