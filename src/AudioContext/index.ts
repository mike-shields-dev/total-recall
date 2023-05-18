import * as Tone from "tone";

const outputVolume = new Tone.Gain(0.125).toDestination();
const synth = new Tone.Synth({
  oscillator: {
    type: "square",
  },
}).connect(outputVolume);

const notes = ["E4", "A3", "C4", "A4", "E2"];
let tones: number[] = [];

function startTone(tone: number) {
  if (tones.includes(tone)) return;
  synth.triggerAttack(notes[tone]);
  tones.push(tone);
}

function stopTone(tone: number) {
  const isExistingTone = tones.includes(tone);
  if (!isExistingTone) return;

  synth.triggerRelease();
  tones = tones.filter((t) => t !== tone);
}

export { startTone, stopTone };
