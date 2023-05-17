interface Props {
  d: string;
  fill: string;
  classNames?: string;
  title: string;
}

const Pad = ({d, fill, classNames, title}: Props) => {
  return (
    <svg>
      <title>{title}</title>
      <path
        d={d}
        className={`${css.Pad} ${classNames}`}
        fill={fill}
      />
    </svg>
  )
}

export default Pad;