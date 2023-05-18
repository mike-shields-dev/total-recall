function createPadSequence(length: number) {
  const steps: number[] = [];

  while(steps.length < length) {
    const step = Math.floor(Math.random() * 4);
    
    if(`${steps.slice(-2)}` === `${[step, step]}`) continue;
    
    steps.push(step);
  }

  return [...steps, -1];
}

export default createPadSequence;