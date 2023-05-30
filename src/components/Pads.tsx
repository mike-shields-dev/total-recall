import Pad from "./Pad";

interface Props {
  isSequencePlaying: boolean;
  activePadIndex: number;
  onPadPress: (padIndex: number) => void;
};

function Pads({ isSequencePlaying, activePadIndex, onPadPress }: Props) {
  return (<>
      <Pad
      onPadPress={onPadPress}
      isSequencePlaying={isSequencePlaying}
      activePadIndex={activePadIndex}
      padIndex={0}
      pathData="
        M 160 80 
        L 160 15
        A 135 135 1 0 1 285 145
        L 220 145
        A 70 70 1 0 0 160 80
        z   
      "
      fill="hsl(0, 100%, 50%)"
    />
    <Pad
      onPadPress={onPadPress}
      isSequencePlaying={isSequencePlaying}
      activePadIndex={activePadIndex}
      padIndex={1}
      pathData="
        M 220 160 
        L 285 160
        A 135 135 1 0 1 160 285
        L 160 220
        A 70 70 1 0 0 220 160
        z  
      "
      fill="hsl(120, 100%, 50%)"
    />
    <Pad
      onPadPress={onPadPress}
      isSequencePlaying={isSequencePlaying}
      activePadIndex={activePadIndex}
      padIndex={2}
      pathData="
        M 145 220 
        L 145 285
        A 135 135 1 0 1 15 160
        L 80 160
        A 70 70 1 0 0 145 220
        z
      "
      fill="hsl(240, 100%, 50%)"
    />
    <Pad
      onPadPress={onPadPress}
      isSequencePlaying={isSequencePlaying}
      activePadIndex={activePadIndex}
      padIndex={3}
      pathData="
        M 80 145 
        L 15 145
        A 135 135 1 0 1 145 15
        L 145 80
        A 70 70 1 0 0 80 145 
        z  
      "
      fill="rgb(255, 255, 0)"
    />
  </>
  )
};

export default Pads;