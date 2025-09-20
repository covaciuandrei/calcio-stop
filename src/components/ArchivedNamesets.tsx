import React from 'react';
import { Nameset } from '../types/types';

interface Props {
  archivedNamesets: Nameset[];
  setArchivedNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  setNamesets: React.Dispatch<React.SetStateAction<Nameset[]>>;
  searchTerm?: string;
}

const ArchivedNamesets: React.FC<Props> = ({ archivedNamesets, setArchivedNamesets, setNamesets, searchTerm = '' }) => {
  const handleRestore = (id: string) => {
    if (!window.confirm('Are you sure you want to restore this nameset?')) return;
    const namesetToRestore = archivedNamesets.find((n) => n.id === id);
    if (namesetToRestore) {
      setNamesets((prev) => [...prev, namesetToRestore]);
      setArchivedNamesets(archivedNamesets.filter((n) => n.id !== id));
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this nameset?')) return;
    setArchivedNamesets(archivedNamesets.filter((n) => n.id !== id));
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
