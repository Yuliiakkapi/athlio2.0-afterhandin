import TableCategory from './TableCategory';

const PASSING_ROWS = [
  { key: 'assists', label: 'Assists', format: 'int' },
  { key: 'touchesPerGame', label: 'Touches per game' },
  { key: 'bigChancesCreated', label: 'Big chances created', format: 'int' },
  { key: 'keyPassesPerGame', label: 'Key passes per game' },
];

export default function TablePassing({ players = [] }) {
  return (
    <TableCategory title="Passes" rows={PASSING_ROWS} players={players} />
  );
}
