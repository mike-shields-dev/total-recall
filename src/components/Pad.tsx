import { startTone, stopTone } from "../AudioContext";
import css from "./Pad.module.css";

interface Props {
  d: string;
  fill: string;
  classNames?: string;
  title: string;
  padIndex: number;
  isActive: boolean;
  uiDisabled: boolean;
}

const Pad = ({d, fill, classNames, title, padIndex, isActive, uiDisabled}: Props) => {
  const handleStartTone = (event: React.MouseEvent) => {
    if(uiDisabled) {
      return;
    }
    startTone(padIndex);
  };

  const handleStopTone = () => {
    if(uiDisabled) {
      return;
    }
    stopTone(padIndex);
  };

  return (
    <svg>
      <title>{title}</title>
      <path
        onMouseDown={handleStartTone}
        onMouseUp={handleStopTone}
        onMouseLeave={handleStopTone}
        d={d}
        className={`
          ${css.Pad} ${classNames || ""} 
          ${isActive ? css.active : ''} 
        `}
        fill={fill}
      />
    </svg>
  )
}

export default Pad;