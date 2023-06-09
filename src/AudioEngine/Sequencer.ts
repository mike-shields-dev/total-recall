import { Transport, Sequence } from "tone";
import { noteNames, BPM, errorNoteIndex } from "../globals";
import PubSub from "pubsub-js";
import {
  SEQUENCE_PLAY,
  SEQUENCE_ENDED,
  ACTIVE_PAD_INDEX,
  SEQUENCE_STARTED,
  FAILED_ATTEMPT,
} from "./PubSub_topics";
import { synth, clearActiveNotes } from "./Synth";

PubSub.subscribe(SEQUENCE_PLAY, (_, sequence) => playSequence(sequence));

PubSub.subscribe(FAILED_ATTEMPT, (_, userSequence) =>
  playFailedAttemptAlert(userSequence)
);

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
  clearActiveNotes();
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
