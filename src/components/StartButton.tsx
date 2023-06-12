import css from "./StartButton.module.css";

interface Props {
  onClick: (event: React.MouseEvent) => void;
  isDisabled: boolean;
}

export default function StartButton({ onClick, isDisabled }: Props) {
  return (
    <svg>
      <circle
        onClick={onClick}
        cx={150}
        cy={150}
        r={20}
        className={`
          ${css.startBtn} 
          ${isDisabled ? css.disabled : css.active}
        `}
      />
      <path
        d="M 145 145 L 154 150 L145 155 z"
        transform="translate(2, 0)"
        pointerEvents="none"
      />
    </svg>
  );
}
