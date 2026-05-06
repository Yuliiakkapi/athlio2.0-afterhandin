import TableCategory from './TableCategory';

const DEFENDING_ROWS = [
  { key: 'tacklesPerGame', label: 'Tackles per game' },
  { key: 'interceptionsPerGame', label: 'Interceptions per game' },
  { key: 'ballsRecovered', label: 'Balls recovered', format: 'int' },
  { key: 'penaltiesCommitted', label: 'Penalties committed', format: 'int' },
];

export default function TableDefending({ players = [] }) {
  return (
    <TableCategory title="Defending" rows={DEFENDING_ROWS} players={players} />
  );
}
