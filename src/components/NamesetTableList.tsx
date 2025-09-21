import React from 'react';
import { Nameset } from '../types/types';

interface Props {
  namesets: Nameset[];
  onEdit: (n: Nameset) => void;
  onDelete?: (id: string) => void;
  onArchive: (id: string) => void;
  searchTerm?: string;
}

const NamesetTableList: React.FC<Props> = ({ namesets, onEdit, onDelete, onArchive, searchTerm = '' }) => {
  // Filter namesets based on search term
  const filteredNamesets = namesets.filter(
    (nameset) =>
      nameset.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameset.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameset.number.toString().includes(searchTerm)
  );

  if (namesets.length === 0) {
    return <p>No namesets available.</p>;
  }

  if (filteredNamesets.length === 0 && searchTerm) {
    return <p>No namesets found matching "{searchTerm}".</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Player</th>
          <th>Number</th>
          <th>Season</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredNamesets.map((n) => (
          <tr key={n.id}>
            <td>{n.playerName}</td>
            <td>{n.number}</td>
            <td>{n.season}</td>
            <td className="price-display">{n.quantity}</td>
            <td>
              <button onClick={() => onEdit(n)} className="btn btn-warning">
                Edit
              </button>
              <button onClick={() => onArchive(n.id)} className="btn btn-secondary">
                Archive
              </button>
              {onDelete && (
                <button onClick={() => onDelete(n.id)} className="btn btn-danger">
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NamesetTableList;
