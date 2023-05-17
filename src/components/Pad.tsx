import { startTone, stopTone } from "../AudioContext";
import css from "./Pad.module.css";

interface Props {
  d: string;
  fill: string;
  classNames?: string;
  title: string;
  padIndex: number;
  isActive: boolean;
}

const Pad = ({d, fill, classNames, title, padIndex, isActive}: Props) => {
  return (
    <svg>
      <title>{title}</title>
      <path
        onMouseDown={() => startTone(padIndex)}
        onMouseUp={() => stopTone(padIndex)}
        onMouseLeave={() => stopTone(padIndex)}
        d={d}
        className={`${css.Pad} ${classNames} ${isActive ? css.active : ''}`}
        fill={fill}
      />
    </svg>
  )
}

export default Pad;