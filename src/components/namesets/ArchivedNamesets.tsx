import React from 'react';
import { useNamesetsActions } from '../../stores';
import { Nameset } from '../../types';

interface Props {
  archivedNamesets: Nameset[];
  searchTerm?: string;
}

const ArchivedNamesets: React.FC<Props> = ({ archivedNamesets, searchTerm = '' }) => {
  // Get store actions
  const { restoreNameset, deleteNameset } = useNamesetsActions();
  const handleRestore = (id: string) => {
    if (!window.confirm('Are you sure you want to restore this nameset?')) return;
    restoreNameset(id);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this nameset?')) return;
    deleteNameset(id);
  };

  // Filter namesets based on search term
  const filteredNamesets = archivedNamesets.filter(
    (nameset) =>
      nameset.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameset.season.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameset.number.toString().includes(searchTerm)
  );

  if (archivedNamesets.length === 0) {
    return <p>No archived namesets available.</p>;
  }

  if (filteredNamesets.length === 0 && searchTerm) {
    return <p>No archived namesets found matching "{searchTerm}".</p>;
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
              <button onClick={() => handleRestore(n.id)} className="btn btn-success">
                Restore
              </button>
              <button onClick={() => handleDelete(n.id)} className="btn btn-danger">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ArchivedNamesets;
