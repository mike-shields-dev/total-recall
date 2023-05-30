import { useState, useEffect } from "react";
import { start as enableAudio } from "tone";
import PubSub from "pubsub-js";
import {
  ACTIVE_PAD_INDEX,
  SEQUENCE_PLAY,
  SEQUENCE_ENDED,
  SEQUENCE_STARTED,
  FAILED_ATTEMPT,
} from "./AudioEngine/PubSubNameSpace";
import Pads from "./components/Pads";
import { noteNames, startingHealth } from "./globals";
import "./App.css";

function App() {
  const [activePadIndex, setActivePadIndex] = useState<number>(-1);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const [gameSequence, setGameSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [userHealth, setUserHealth] = useState(startingHealth);
  const [isUsersAttempt, setIsUsersAttempt] = useState(false);
  const [didUserAttempt, setDidUserAttempt] = useState(true);
  const [gameLevel, setGameLevel] = useState(1);

  function handleStart() {
    if (isSequencePlaying) return;
    if(!didUserAttempt) setUserHealth(userHealth - 1);

    const newGameSequence = [...gameSequence];

    if (newGameSequence.length < gameLevel) {
      const newStep = Math.floor(Math.random() * noteNames.slice(0, -1).length);
      newGameSequence.push(newStep);

      setGameSequence(newGameSequence);
      setUserSequence([]);
    }

    PubSub.publish(SEQUENCE_PLAY, newGameSequence);
  }

  function onPadPress(padIndex: number) {
    if (!isUsersAttempt || isSequencePlaying) return;
    
    setDidUserAttempt(true);
    
    const newUserSequence = [...userSequence, padIndex];
    setUserSequence(newUserSequence);
  }

  useEffect(() => {
    if (!isUsersAttempt) return;

    const isMatch = userSequence.every((step, i) => step === gameSequence[i]);

    if (!isMatch) {
      setUserHealth(userHealth - 1);
      setIsUsersAttempt(false);
      setUserSequence([]);
      PubSub.publish(FAILED_ATTEMPT, userSequence);
      return;
    }

    if (userSequence.length === gameSequence.length) {
      setIsUsersAttempt(false);
      setGameLevel(gameLevel + 1);
      setUserSequence([]);
    }
  }, [userSequence, gameSequence, isUsersAttempt]);

  useEffect(() => {
    const onSequenceStarted = PubSub.subscribe(SEQUENCE_STARTED, () =>
      setIsSequencePlaying(true)
    );

    const onSequenceEnded = PubSub.subscribe(SEQUENCE_ENDED, () => {
      setIsSequencePlaying(false);
      setIsUsersAttempt(true);
      setDidUserAttempt(false);
    });

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
    <div style={{ padding: "1em" }} onClick={enableAudio}>
      <div>Health: {userHealth} Level: {gameLevel -1}</div>
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
          isSequencePlaying={isSequencePlaying}
          activePadIndex={activePadIndex}
          onPadPress={onPadPress}
        />
      </svg>
    </div>
  );
}

export default App;
