import { Gain, Synth } from 'tone';

const outputVolume = new Gain(0.075).toDestination();
const synth = new Synth({
  envelope: { attack: 0.02, release: 0.1 },
  oscillator: {
    type: "square",
  },
}).connect(outputVolume);

export default synth;