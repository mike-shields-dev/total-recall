import { Transport, Sequence } from "tone";
import { noteNames, BPM, errorNoteIndex } from "../globals";
import PubSub from "pubsub-js";
import {
  SEQUENCE_PLAY,
  SEQUENCE_ENDED,
  ACTIVE_PAD_INDEX,
  NOTE_ON,
  NOTE_OFF,
  SEQUENCE_STARTED,
  FAILED_ATTEMPT,
} from "./PubSubNameSpace";
import synth from "./Synth";

PubSub.subscribe(SEQUENCE_PLAY, (_, sequence) => playSequence(sequence));
PubSub.subscribe(NOTE_ON, (_, noteIndex) => noteOn(noteIndex));
PubSub.subscribe(NOTE_OFF, (_, noteIndex) => noteOff(noteIndex));
PubSub.subscribe(FAILED_ATTEMPT, (_, userSequence) =>
  playFailedAttemptAlert(userSequence)
);

let activeNotes: number[] = [];

function noteOn(noteIndex: number) {
  if (activeNotes.includes(noteIndex)) return;

  synth.triggerAttack(noteNames[noteIndex]);
  activeNotes.push(noteIndex);
}

function noteOff(noteIndex: number) {
  const isExistingTone = activeNotes.includes(noteIndex);
  if (!isExistingTone) return;

  synth.triggerRelease();
  activeNotes = activeNotes.filter((activeNote) => activeNote !== noteIndex);
}

function resetTransport() {
  Transport.stop().cancel();
}

function playNote(noteName: string, durationMs: number, time: number) {
  synth.triggerAttackRelease(noteName, durationMs, time);
}

function playSequence(noteIndexSequence: number[]) {
  resetTransport();
  Transport.set({ bpm: BPM });
  PubSub.publish(SEQUENCE_STARTED);

  const durationSecs = 0.3 * (60 / BPM);
  const durationMSecs = 1000 * durationSecs;

  const noteSequence = new Sequence(
    (time, noteIndex) => {
      const isSequenceComplete = noteIndex < 0;
      if (isSequenceComplete) return PubSub.publish(SEQUENCE_ENDED);

      playNote(noteNames[noteIndex], durationSecs, time);
      PubSub.publish(ACTIVE_PAD_INDEX, noteIndex);

      setTimeout(() => PubSub.publish(ACTIVE_PAD_INDEX, -1), durationMSecs);
    },
    [...noteIndexSequence, -1]
  ).start(0);

  noteSequence.loop = false;

  Transport.start();
}

function playFailedAttemptAlert(userSequence: number[]) {
  const bpm = 20;
  synth.triggerRelease(0);
  activeNotes = [];
  resetTransport();
  Transport.set({ bpm });

  const durationSecs = 0.5 * (60 / bpm);

  const noteSequence = new Sequence(
    (time, noteIndex) => {
      const isSequenceEnded = noteIndex < 0;

      if (isSequenceEnded) {
        PubSub.publish(SEQUENCE_ENDED);
        PubSub.publish(ACTIVE_PAD_INDEX, -1);
        return;
      }

      playNote(noteNames[noteIndex], durationSecs, time);
      PubSub.publish(ACTIVE_PAD_INDEX, userSequence.at(-1));
    },

    [errorNoteIndex, -1]
  ).start(0);

  noteSequence.loop = false;

  Transport.start();
  PubSub.publish(SEQUENCE_STARTED);
}
