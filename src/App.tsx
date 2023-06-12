import { useState, useEffect } from "react";
import { start as enableAudio } from "tone";
import PubSub from "pubsub-js";
import {
  ACTIVE_PAD_INDEX,
  SEQUENCE_PLAY,
  SEQUENCE_ENDED,
  SEQUENCE_STARTED,
  FAILED_ATTEMPT,
} from "./AudioEngine/PubSub_topics";
import Pads from "./components/Pads";
import Header from "./components/Header";
import { padNoteNames, startingHealth } from "./globals";

import "./App.css";

function App() {
  const [activePadIndex, setActivePadIndex] = useState<number>(-1);
  const [isSequencePlaying, setIsSequencePlaying] = useState(false);
  const [gameSequence, setGameSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [userHealth, setUserHealth] = useState(startingHealth);
  const [isUsersAttempt, setIsUsersAttempt] = useState(false);
  const [gameLevel, setGameLevel] = useState(1);
  const [hasSequenceBeenPlayed, setHasSequenceBeenPlayed] = useState(false);

  function handleStart() {
    if (isSequencePlaying) return;
    if (hasSequenceBeenPlayed) setUserHealth(userHealth - 1);

    setUserSequence([]);

    let newGameSequence = [...gameSequence];

    while (newGameSequence.length < gameLevel) {
      const newStep = Math.floor(Math.random() * padNoteNames.length);
      const lastTwoSteps = gameSequence.slice(-2);

      if (`${lastTwoSteps}` !== `${[newStep, newStep]}`) {
        newGameSequence = [...newGameSequence, newStep];
      }
    }

    setGameSequence(newGameSequence);

    if (newGameSequence.length < gameLevel) {
      const newStep = Math.floor(Math.random() * padNoteNames.length);
      newGameSequence.push(newStep);

      setGameSequence(newGameSequence);
      setUserSequence([]);
    }

    PubSub.publish(SEQUENCE_PLAY, newGameSequence);
  }

  function onPadPress(padIndex: number) {
    if (!isUsersAttempt || isSequencePlaying) return;

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
      setHasSequenceBeenPlayed(false);
    }
  }, [userSequence, gameSequence, isUsersAttempt]);

  useEffect(() => {
    const onSequenceStarted = PubSub.subscribe(SEQUENCE_STARTED, () =>
      setIsSequencePlaying(true)
    );

    const onSequenceEnded = PubSub.subscribe(SEQUENCE_ENDED, () => {
      setIsSequencePlaying(false);
      setHasSequenceBeenPlayed(true);
      setIsUsersAttempt(true);
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
    <main
      onClick={enableAudio}
      style={{ height: "100vh", display: "grid", placeContent: "center" }}
    >
      <Header health={userHealth} level={gameLevel} />
      <svg
        style={{ aspectRatio: 1, width: "min(90vw, 90vh)" }}
        viewBox="0 0 300 300"
      >
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
    </main>
  );
}

export default App;
