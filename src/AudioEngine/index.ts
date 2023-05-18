import * as Tone from "tone";
import { padNotes } from "../globals";

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
  synth.triggerAttack(padNotes[tone]);
  tones.push(tone);
}

function stopTone(tone: number) {
  const isExistingTone = tones.includes(tone);
  if (!isExistingTone) return;

  synth.triggerRelease();
  tones = tones.filter((t) => t !== tone);
}

export { startTone, stopTone, synth };
