import React from 'react';
import TableStats from './TableStats';
import './Tables.css';
import TableAttacking from './TableAttacking';
import TablePassing from './TablePassing';
import TableDefending from './TableDefending';

export default function Tables({ players = [] }){
  const count = players.length;

  return (
    <div className="scouting-tables">
      <div className="tables-grid">
        {count >= 1 && (
          <TableStats players={players.slice(0, Math.min(count, 3))} />
        )}
        {count >= 1 && (
          <TableAttacking players={players.slice(0, Math.min(count, 3))} />
        )}
        {count >= 1 && (
          <TableDefending players={players.slice(0, Math.min(count, 3))} />
        )}
        {count >= 1 && (
          <TablePassing players={players.slice(0, Math.min(count, 3))} />
        )}
      </div>
    </div>
  )
}
