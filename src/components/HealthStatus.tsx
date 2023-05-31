import Icon from "./HeartIcon";

interface Props {
  health: number;
}

function HealthStatus({ health }: Props) {
  const icons = Array.from({ length: health }, (_, i) => (
    <Icon key={`health-icon--${i}`} fill="red" />
  ));

  return (
    <div>
      <span>Health</span> <span>{icons}</span>
    </div>
  );
}

export default HealthStatus;
