import { useState, useEffect } from "react";
import { startTone, stopTone } from "../AudioEngine/AudioEngine";
import css from "./Pad.module.css";

interface Props {
  pathData: string;
  fill: string;
  classNames?: string;
  title: string;
  padIndex: number;
  activePadIndex: number;
  uiDisabled: boolean;
}

const Pad = ({pathData, fill, classNames, title, padIndex, activePadIndex, uiDisabled}: Props) => {
  const [isPadActive, setIsPadActive] = useState(false);
  
  useEffect(() => {
      setIsPadActive(activePadIndex === padIndex);
  }, [activePadIndex]);
  
  const handleStartTone = (event: React.MouseEvent) => {
    if(event.button !== 0) return;
    if(uiDisabled) return;
    
    startTone(padIndex);
    setIsPadActive(true);
  };

  const handleStopTone = (event: React.MouseEvent) => {
    if(event.button !== 0) return;
    if(uiDisabled) return;
    
    stopTone(padIndex);
    setIsPadActive(false);
  };

  return (
    <svg>
      <title>{title}</title>
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