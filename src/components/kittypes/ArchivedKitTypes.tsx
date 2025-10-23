import React from 'react';
import { isDefaultKitType } from '../../constants/kitTypes';
import { useKitTypesActions, useKitTypesStore } from '../../stores';
import { KitType } from '../../types';

interface Props {
  archivedKitTypes: KitType[];
  searchTerm?: string;
  onClearSearch?: () => void;
}

const ArchivedKitTypes: React.FC<Props> = ({ archivedKitTypes, searchTerm = '', onClearSearch }) => {
  // Get store actions and state
  const { restoreKitType, deleteKitType } = useKitTypesActions();
  const { error, clearError } = useKitTypesStore();
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
    <div>
      {error && (
        <div
          className="error-message"
          style={{
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '4px',
          }}
        >
          {error}
          <button
            onClick={clearError}
            style={{ marginLeft: '0.5rem', background: 'none', border: 'none', fontSize: '1.2em', cursor: 'pointer' }}
            title="Clear error"
          >
            ×
          </button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Kit Type Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredKitTypes.map((kt) => {
            const isDefault = isDefaultKitType(kt);

            return (
              <tr key={kt.id}>
                <td>{kt.name}</td>
                <td>
                  <button onClick={() => handleRestore(kt.id)} className="btn btn-icon btn-success" title="Restore">
                    ↩️
                  </button>
                  {!isDefault && (
                    <button onClick={() => handleDelete(kt.id)} className="btn btn-danger">
                      Delete Forever
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ArchivedKitTypes;
