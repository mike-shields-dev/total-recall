import { startTone, stopTone } from "../AudioContext";
import css from "./Pad.module.css";

interface Props {
  d: string;
  fill: string;
  classNames?: string;
  title: string;
  padIndex: number;
}

const Pad = ({d, fill, classNames, title, padIndex}: Props) => {
  return (
    <svg>
      <title>{title}</title>
      <path
        onMouseDown={() => startTone(padIndex)}
        onMouseUp={() => stopTone(padIndex)}
        onMouseLeave={() => stopTone(padIndex)}
        d={d}
        className={`${css.Pad} ${classNames}`}
        fill={fill}
      />
    </svg>
  )
}

export default Pad;