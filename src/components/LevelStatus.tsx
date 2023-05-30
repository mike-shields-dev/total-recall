interface Props {
  level: number;
}

function LevelStatus({ level }: Props) {
  return (
    <div>
      <span>Level</span>{" "}
      <span>{level}</span>
    </div>
  );
}

export default LevelStatus;