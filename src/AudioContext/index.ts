const actx = new AudioContext({ sampleRate: 12000 });

const masterVol = actx.createGain();
masterVol.gain.setValueAtTime(0.05, actx.currentTime);
masterVol.connect(actx.destination);

interface Tone {
  id: number;
  oscillator: OscillatorNode
};

const frequencies = [329.628, 220, 261.6, 440, 82];
let tones = <Tone[]>[];

function findTone(index: number) {
  return tones.find(tone => tone.id === index);
}

function startTone(index: number) {
  const existingTone = findTone(index);
  
  if(existingTone) return;
  
  const tone = {
    id: index,
    oscillator: actx.createOscillator()
  }

  tone.oscillator.frequency.setValueAtTime(frequencies[index], actx.currentTime);
  tone.oscillator.type = "square";
  tone.oscillator.connect(masterVol);
  tone.oscillator.start();
  
  tones.push(tone);
}

function stopTone(index: number) {
  const foundTone = tones.find(tone => tone.id === index);

  foundTone?.oscillator.stop();
  foundTone?.oscillator.disconnect();

  tones = tones.filter(tone => !foundTone);
}

export { startTone, stopTone};
