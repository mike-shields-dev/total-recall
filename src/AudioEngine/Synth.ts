import { Gain, Synth } from 'tone';
import { NOTE_ON, NOTE_OFF } from './PubSub_topics';
import { noteNames } from '../globals';

const outputVolume = new Gain(0.075).toDestination();
const synth = new Synth({
  envelope: { attack: 0.02, release: 0.1 },
  oscillator: {
    type: "square",
  },
}).connect(outputVolume);

PubSub.subscribe(NOTE_ON, (_, noteIndex) => noteOn(noteIndex));
PubSub.subscribe(NOTE_OFF, (_, noteIndex) => noteOff(noteIndex));

let activeNotes: number[] = [];

function noteOn(noteIndex: number) {
  if (activeNotes.includes(noteIndex)) return;

  synth.triggerAttack(noteNames[noteIndex]);
  activeNotes = [...activeNotes, noteIndex];
}

function noteOff(noteIndex: number) {
  if (!activeNotes.includes(noteIndex)) return;

  synth.triggerRelease();
  activeNotes = activeNotes.filter((activeNote) => activeNote !== noteIndex);
}

function clearActiveNotes() {
  activeNotes = [];
}

export { synth, clearActiveNotes };
