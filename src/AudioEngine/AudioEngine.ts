import * as Tone from "tone";
import { noteNames, BPM } from "../globals";

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
  Tone.Transport
    .stop()
    .cancel()
    .set({ bpm: BPM });
}

function startSequencer() {
  Tone.Transport.start();
}

function playNote(noteName: string, duration: number) {
  synth.triggerAttackRelease(noteName, duration);
};

export { startTone, stopTone, synth, resetSequencer, startSequencer, playNote };
