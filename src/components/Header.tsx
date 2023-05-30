import HealthStatus from './HealthStatus';
import LevelStatus from './LevelStatus';

interface Props {
  health: number;
  level: number;
};

function Header({ health, level }: Props) {
  return (
    <header>
      <HealthStatus health={health} />
      <LevelStatus level={level} />
    </header>
  );
}

export default Header;