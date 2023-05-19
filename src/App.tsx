import { useState, useEffect } from "react";
import PubSub from "pubsub-js";
import {
  ACTIVE_PAD_INDEX,
  SEQUENCER_PLAY,
  SEQUENCE_ENDED,
  SEQUENCE_STARTED,
} from "./AudioEngine/PubSubNameSpace";
import Pads from "./components/Pads";
import { noteNames, startingHealth } from "./globals";
import "./App.css";

function App() {
  const [activePadIndex, setActivePadIndex] = useState<number>(-1);
  const [uiDisabled, setUiDisabled] = useState(false);
  const [gameSequence, setGameSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [userHealth, setUserHealth] = useState(startingHealth); 

  function handleStart() {
    if (uiDisabled) return;
    setUiDisabled(true);
    const newStep = Math.floor(Math.random() * noteNames.length);
    const newSequence = [...gameSequence, newStep];

    setGameSequence(newSequence);
    setUserSequence([]);
    PubSub.publish(SEQUENCER_PLAY, newSequence);
  }

  function onUserAttempt(padIndex: number) {
    const newUserSequence = [...userSequence, padIndex];
    setUserSequence(newUserSequence);
  }

  useEffect(() => {
    console.log({ gameSequence, userSequence });
    const isMatch = userSequence.every((step, i) => step === gameSequence[i]);
    if(!isMatch) { 
      setUserHealth(userHealth - 1) 
    }
  }, [userSequence, gameSequence]);

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
      <div>Health: {userHealth}</div>
      <svg style={{ aspectRatio: 1 }} viewBox="0 0 300 300">
        <circle cx={150} cy={150} r={150} />
        <circle cx={150} cy={150} r={55} fill="grey" onClick={handleStart} />
        <circle onClick={handleStart} cx={150} cy={150} r={10} fill="red" />
        <path
          d="M 145 145 L 154 150 L145 155 z"
          transform="translate(2, 0)"
          pointerEvents="none"
        />

        <Pads
          uiDisabled={uiDisabled}
          activePadIndex={activePadIndex}
          onUserAttempt={onUserAttempt}
        />
      </svg>
    </div>
  );
}

export default App;
