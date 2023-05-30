import HealthStatus from './HealthStatus';

interface Props {
  health: number;
  level: number;
};

function Header({ health, level }: Props) {
  return (
    <header>
      <HealthStatus health={health} />
    </header>
  );
}

export default Header;