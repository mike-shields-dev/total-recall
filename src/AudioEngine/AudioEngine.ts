import { Transport, Sequence } from "tone";
import { noteNames, BPM } from "../globals";
import PubSub from 'pubsub-js';
import { SEQUENCER_PLAY, SEQUENCE_ENDED, ACTIVE_PAD_INDEX, NOTE_ON, NOTE_OFF } from "./PubSubNameSpace";
import synth from "./Synth";

PubSub.subscribe(SEQUENCER_PLAY, (_, sequence) => playSequence(sequence));
PubSub.subscribe(NOTE_ON, (_, noteIndex) => noteOn(noteIndex));
PubSub.subscribe(NOTE_OFF, (_, noteIndex) => noteOff(noteIndex));

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
  Transport.stop().cancel().set({ bpm: BPM });
}

function playNote(noteName: string, durationMs: number, time: number) {
  synth.triggerAttackRelease(noteName, durationMs, time);
}

function playSequence(padSequence: number[]) {
  resetTransport();

  const durationSecs = 0.3 * (60 / BPM);
  const durationMSecs = 1000 * durationSecs;

  const noteSequence = new Sequence((time, padIndex) => {
    const isSequenceComplete = padIndex < 0;
    if(isSequenceComplete) return PubSub.publish(SEQUENCE_ENDED)
    
    playNote(noteNames[padIndex], durationSecs, time);
    PubSub.publish(ACTIVE_PAD_INDEX, padIndex);
    
    setTimeout(() => PubSub.publish(ACTIVE_PAD_INDEX, -1), durationMSecs)
  }, [...padSequence, -1]).start(0);
  
  noteSequence.loop = false;
  
  Transport.start();
}
