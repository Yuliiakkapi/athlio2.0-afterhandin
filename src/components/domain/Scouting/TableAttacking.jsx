import TableCategory from './TableCategory';

const ATTACKING_ROWS = [
  { key: 'scoringPerMinute', label: 'Scoring per minute' },
  { key: 'goals', label: 'Goals', format: 'int' },
  { key: 'goalsPerGame', label: 'Goals per game' },
  { key: 'shotsPerGame', label: 'Shots per game' },
];

export default function TableAttacking({ players = [] }) {
  return (
    <TableCategory title="Attacking" rows={ATTACKING_ROWS} players={players} />
  );
}
