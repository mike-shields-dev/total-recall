import HealthStatus from './HealthStatus';
import LevelStatus from './LevelStatus';

import css from './Header.module.css';

interface Props {
  health: number;
  level: number;
};

function Header({ health, level }: Props) {
  return (
    <header className={css.Header}>
      <HealthStatus health={health} />
      <LevelStatus level={level} />
    </header>
  );
}

export default Header;