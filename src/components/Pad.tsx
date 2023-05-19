import { useState, useEffect } from "react";
import PubSub from "pubsub-js";
import { NOTE_OFF, NOTE_ON } from '../AudioEngine/PubSubNameSpace';
import css from "./Pad.module.css";

interface Props {
  pathData: string;
  fill: string;
  classNames?: string;
  padIndex: number;
  activePadIndex: number;
  uiDisabled: boolean;
}

const Pad = ({pathData, fill, classNames, padIndex, activePadIndex, uiDisabled}: Props) => {
  const [isPadActive, setIsPadActive] = useState(false);
  
  useEffect(() => {
      setIsPadActive(activePadIndex === padIndex);
  }, [activePadIndex]);
  
  const handleStartTone = (event: React.MouseEvent) => {
    if(event.button !== 0) return;
    if(uiDisabled) return;
    
    PubSub.publish(NOTE_ON, padIndex);
    setIsPadActive(true);
  };

  const handleStopTone = (event: React.MouseEvent) => {
    if(event.button !== 0) return;
    if(uiDisabled) return;
    
    PubSub.publish(NOTE_OFF, padIndex);
    setIsPadActive(false);
  };

  return (
    <svg>
      <path
        onMouseDown={handleStartTone}
        onMouseUp={handleStopTone}
        onMouseLeave={handleStopTone}
        onContextMenu={(e) => e.preventDefault()}
        d={pathData}
        className={`
          ${css.Pad} ${classNames || ""} 
          ${isPadActive ? css.active : ''} 
        `}
        fill={fill}
      />
    </svg>
  )
}

export default Pad;