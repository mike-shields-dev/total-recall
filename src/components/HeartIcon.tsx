import css from "./HeartIcon.module.css";

interface Props {
  style?: object;
  fill?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

function HeartIcon({
  style,
  fill,
  strokeColor,
  strokeWidth,
}: Props) {
  return (
    <svg
      width="1em"
      className={css.svg}
      style={style}
      viewBox="-5 -5 110 110"
      fill={fill}
      strokeWidth={strokeWidth}
      stroke={strokeColor}
    >
      <path
        className={css.path}
        strokeLinecap="round"
        d="
              M50 12
              A 10 10 1 0 1 95 43
              L50 100
              M50 12
              A 10 10 1 0 0 5 43
              L50 100
            "
      />
    </svg>
  );
}

export default HeartIcon;
