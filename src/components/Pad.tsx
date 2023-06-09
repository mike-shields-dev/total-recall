import { useState, useEffect } from "react";
import PubSub from "pubsub-js";
import { NOTE_OFF, NOTE_ON } from "../AudioEngine/PubSub_topics";
import css from "./Pad.module.css";

interface Props {
  pathData: string;
  fill: string;
  classNames?: string;
  padIndex: number;
  activePadIndex: number;
  isSequencePlaying: boolean;
  onPadPress: (padIndex: number) => void;
}

const Pad = ({
  pathData,
  fill,
  classNames,
  padIndex,
  activePadIndex,
  onPadPress,
  isSequencePlaying,
}: Props) => {
  const [isPadActive, setIsPadActive] = useState(false);

  useEffect(() => {
    setIsPadActive(activePadIndex === padIndex);
  }, [activePadIndex]);

  const onMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 0 || isSequencePlaying) return;

    onPadPress(padIndex);
    PubSub.publish(NOTE_ON, padIndex);
    setIsPadActive(true);
  };

  const onMouseUpOrLeave = (event: React.MouseEvent) => {
    if (event.button !== 0 || isSequencePlaying) return;

    PubSub.publish(NOTE_OFF, padIndex);
    setIsPadActive(false);
  };

  return (
    <svg>
      <path
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUpOrLeave}
        onMouseLeave={onMouseUpOrLeave}
        onContextMenu={(e) => e.preventDefault()}
        d={pathData}
        className={`
          ${css.Pad} ${classNames || ""} 
          ${isPadActive ? css.active : ""} 
        `}
        fill={fill}
      />
    </svg>
  );
};

export default Pad;
