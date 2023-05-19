import * as Tone from "tone";
import { noteNames, BPM } from "../globals";
import PubSub from 'pubsub-js';
import { SEQUENCER_PLAY, SEQUENCE_ENDED, ACTIVE_PAD_INDEX } from "./PubSubNameSpace";

const outputVolume = new Tone.Gain(0.075).toDestination();
const synth = new Tone.Synth({
  envelope: { attack: 0.02, release: 0.1 },
  oscillator: {
    type: "square",
  },
}).connect(outputVolume);

let tones: number[] = [];

function startTone(tone: number) {
  if (tones.includes(tone)) return;
  synth.triggerAttack(noteNames[tone]);
  tones.push(tone);
}

function stopTone(tone: number) {
  const isExistingTone = tones.includes(tone);
  if (!isExistingTone) return;

  synth.triggerRelease();
  tones = tones.filter((t) => t !== tone);
}

function resetSequencer() {
  Tone.Transport.stop().cancel().set({ bpm: BPM });
}

function startSequencer() {
  Tone.Transport.start();
}

function playNote(noteName: string, durationMs: number, time: number) {
  synth.triggerAttackRelease(noteName, durationMs, time);
}

PubSub.subscribe(SEQUENCER_PLAY, (_, sequence) => playSequence(sequence));

function playSequence(padSequence: number[]) {
  resetSequencer();

  const durationSecs = 0.3 * (60 / BPM);
  const durationMSecs = 1000 * durationSecs;

  const noteSequence = new Tone.Sequence((time, padIndex) => {
    const isSequenceComplete = padIndex < 0;
    if(isSequenceComplete) return PubSub.publish(SEQUENCE_ENDED)
    
    playNote(noteNames[padIndex], durationSecs, time);
    PubSub.publish(ACTIVE_PAD_INDEX, padIndex);
    
    setTimeout(() => PubSub.publish(ACTIVE_PAD_INDEX, -1), durationMSecs)
  }, padSequence).start(0);

  noteSequence.loop = false;

  startSequencer();
}

export { startTone, stopTone, resetSequencer, startSequencer, playNote };
