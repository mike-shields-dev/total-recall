import Chassis from "./Chassis";
import StartButton from "./StartButton";
import Pads from "./Pads";

interface Props {
  isUIDisabled: boolean;
  handleStart: () => void;
  onPadPress: (index: number) => void;
  activePadIndex: number;
}

export default function GameUI({
  isUIDisabled, 
  handleStart, 
  onPadPress, 
  activePadIndex, 
}: Props) {
  return (
    <svg
      style={{ aspectRatio: 1, width: "min(90vw, 90vh)" }}
      viewBox="0 0 300 300"
    >
      <Chassis />
      <StartButton isDisabled={isUIDisabled} onClick={handleStart} />
      <Pads
        isSequencePlaying={isUIDisabled}
        activePadIndex={activePadIndex}
        onPadPress={onPadPress}
      />
    </svg>
  );
}
