import React from 'react';
import { useKitTypesActions } from '../../stores';
import { KitType } from '../../types';

interface Props {
  archivedKitTypes: KitType[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedKitTypes: React.FC<Props> = ({ archivedKitTypes, searchTerm = '', onClearSearch }) => {
  // Get store actions
  const { restoreKitType, deleteKitType } = useKitTypesActions();
  // Filter kit types based on search term
  const filteredKitTypes = archivedKitTypes.filter((kitType) =>
    kitType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestore = (id: string) => {
    restoreKitType(id);
    onClearSearch?.(); // Clear search after action
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this kit type?')) {
      deleteKitType(id);
      onClearSearch?.(); // Clear search after action
    }
  };

  if (archivedKitTypes.length === 0) {
    return <p>No archived kit types available.</p>;
  }

  if (filteredKitTypes.length === 0 && searchTerm) {
    return <p>No archived kit types found matching "{searchTerm}".</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Kit Type Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredKitTypes.map((kt) => (
          <tr key={kt.id}>
            <td>{kt.name}</td>
            <td>
              <button onClick={() => handleRestore(kt.id)} className="btn btn-icon btn-success" title="Restore">
                ↩️
              </button>
              <button onClick={() => handleDelete(kt.id)} className="btn btn-danger">
                Delete Forever
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ArchivedKitTypes;
